import { OrderStatus, PrismaClient } from '@prisma/client'
import { mockUsers } from './mockUsers'
import { mockProducts } from './mockProducts'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

const seedUsers = async () => {
    console.log('Seeding 1000 users')
    await prisma.user.createMany({
        data: mockUsers.map(u => ({ ...u, password: hashSync(u.password) })),
    })
    const admin = await prisma.user.create({
        data: {
            name: 'admin',
            password: hashSync('admin'),
            email: 'admin@admin.com',
            rolesName: 'admin',
        },
        select: { uid: true },
    })

    return admin.uid
}

const seedProduct = async (adminUid: string) => {
    console.log('Seeding 1000 products')
    await prisma.product.createMany({
        data: mockProducts.map(p => ({ ...p, addedUserId: adminUid })),
    })
}

const seedRoles = async () => {
    console.log('Seeding predefined roles')
    await prisma.roles.createMany({
        data: [
            {
                name: 'admin',
                isSuperAdmin: true,
                canOrder: true,
                canAddProduct: true,
                canRefillProduct: true,
            },
            {
                name: 'productManager',
                isSuperAdmin: false,
                canOrder: false,
                canAddProduct: true,
                canRefillProduct: true,
            },
            {
                name: 'orderManager',
                isSuperAdmin: false,
                canOrder: true,
                canAddProduct: false,
                canRefillProduct: true,
            },
        ],
    })
}

const seedOrders = async () => {
    console.log('Seeding 100 orders')
    const userIds = await prisma.user.findMany({
        where: {},
        select: { uid: true },
    })
    const productIds = await prisma.product.findMany({
        where: {},
        select: { pid: true },
    })

    const status = Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>

    function randomDate() {
        const end = new Date() // Today
        const start = new Date()
        start.setFullYear(end.getFullYear() - 3) // 3 years ago
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        )
    }

    const orderData = Array.from({ length: 100 }).map(_ => {
        const randomUid =
            userIds[Math.floor(Math.random() * userIds.length)].uid
        const randomPid =
            productIds[Math.floor(Math.random() * productIds.length)].pid
        const randomState = status[Math.floor(Math.random() * status.length)]
        const d = randomDate()
        return {
            userUid: randomUid,
            productPid: randomPid,
            status: randomState,
            createdAt: d,
            updatedAt: d,
        }
    })

    await prisma.order.createMany({
        data: orderData,
    })
}

const seed = async () => {
    await seedRoles()
    const adminUid = await seedUsers()
    await seedProduct(adminUid)
    await seedOrders()
}

seed().catch(console.error)
