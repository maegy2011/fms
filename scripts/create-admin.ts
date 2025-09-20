import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('Creating admin user...')

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@fms.com',
        phone: '0500000000',
        name: 'مدير النظام',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isApproved: true
      }
    })

    console.log('Admin user created successfully:')
    console.log('Username:', admin.username)
    console.log('Email:', admin.email)
    console.log('Password: admin123')
    console.log('Role:', admin.role)

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()