import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Schema for user validation
const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN']).optional()
})

const securityQuestionSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  userId: z.string()
})

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        isActive: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
        securityQuestion: {
          select: {
            question: true
          }
        },
        _count: {
          select: {
            incomes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user (registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { securityQuestion, ...userData } = body
    
    const validatedData = userSchema.parse(userData)

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'اسم المستخدم موجود بالفعل' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني موجود بالفعل' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await db.user.findUnique({
      where: { phone: validatedData.phone }
    })

    if (existingPhone) {
      return NextResponse.json(
        { error: 'رقم الهاتف موجود بالفعل' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        phone: validatedData.phone,
        name: validatedData.name,
        password: hashedPassword,
        role: validatedData.role || 'USER'
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        isActive: true,
        isApproved: true,
        createdAt: true
      }
    })

    // Create security question if provided
    if (securityQuestion) {
      const validatedSecurityData = securityQuestionSchema.parse({
        ...securityQuestion,
        userId: user.id
      })

      await db.securityQuestion.create({
        data: validatedSecurityData
      })
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'خطأ في التحقق من البيانات', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المستخدم' },
      { status: 500 }
    )
  }
}