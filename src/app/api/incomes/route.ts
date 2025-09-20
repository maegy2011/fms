import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for income validation
const incomeSchema = z.object({
  amount: z.number().positive(),
  dueDate: z.string(),
  entityId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number(),
  type: z.enum(['SUBSCRIPTION', 'LEGAL_FEES', 'PENALTIES', 'AUTOMATION', 'OTHER']),
  description: z.string().optional(),
  gpNumber: z.string().optional(),
  userId: z.string()
})

// GET /api/incomes - Get all incomes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const entityId = searchParams.get('entityId')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (month) where.month = parseInt(month)
    if (year) where.year = parseInt(year)
    if (entityId) where.entityId = entityId
    if (type) where.type = type

    const incomes = await db.income.findMany({
      where,
      include: {
        entity: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        dueDate: 'desc'
      }
    })

    return NextResponse.json(incomes)
  } catch (error) {
    console.error('Error fetching incomes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incomes' },
      { status: 500 }
    )
  }
}

// POST /api/incomes - Create new income
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = incomeSchema.parse(body)

    // Check if entity exists
    const entity = await db.entity.findUnique({
      where: { id: validatedData.entityId }
    })

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: validatedData.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const income = await db.income.create({
      data: {
        amount: validatedData.amount,
        dueDate: new Date(validatedData.dueDate),
        entityId: validatedData.entityId,
        month: validatedData.month,
        year: validatedData.year,
        type: validatedData.type,
        description: validatedData.description,
        gpNumber: validatedData.gpNumber,
        userId: validatedData.userId
      },
      include: {
        entity: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating income:', error)
    return NextResponse.json(
      { error: 'Failed to create income' },
      { status: 500 }
    )
  }
}