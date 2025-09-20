import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@fms.com',
      phone: '0500000000',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      isApproved: true,
    },
  })

  console.log('✅ Admin user created/updated:', admin.username)

  // Create some entities
  const entities = [
    { name: 'وزارة التجارة', province: 'الرياض' },
    { name: 'شركة الاتصالات', province: 'جدة' },
    { name: 'البنك الأهلي', province: 'الدمام' },
    { name: 'شركة الكهرباء', province: 'الرياض' },
    { name: 'وزارة الصحة', province: 'مكة' },
  ]

  for (const entity of entities) {
    // Check if entity exists first
    const existingEntity = await prisma.entity.findFirst({
      where: { name: entity.name }
    })
    
    if (!existingEntity) {
      await prisma.entity.create({
        data: entity,
      })
      console.log(`✅ Created entity: ${entity.name}`)
    } else {
      console.log(`ℹ️  Entity already exists: ${entity.name}`)
    }
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })