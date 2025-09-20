import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for entity validation
const entitySchema = z.object({
  name: z.string().min(1),
  mainEntityId: z.string().optional(),
  province: z.string().min(1),
  type: z.enum(['MAIN', 'SUB', 'EMPLOYEE']).optional()
})

// GET /api/entities - Get all entities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const province = searchParams.get('province')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (province) where.province = province
    if (type) where.type = type

    const entities = await db.entity.findMany({
      where,
      include: {
        mainEntity: {
          select: {
            id: true,
            name: true
          }
        },
        subEntities: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            incomes: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(entities)
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    )
  }
}

// POST /api/entities - Create new entity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = entitySchema.parse(body)

    // If mainEntityId is provided, check if it exists
    if (validatedData.mainEntityId) {
      const mainEntity = await db.entity.findUnique({
        where: { id: validatedData.mainEntityId }
      })

      if (!mainEntity) {
        return NextResponse.json(
          { error: 'Main entity not found' },
          { status: 404 }
        )
      }
    }

    const entity = await db.entity.create({
      data: {
        name: validatedData.name,
        mainEntityId: validatedData.mainEntityId,
        province: validatedData.province,
        type: validatedData.type || 'MAIN'
      },
      include: {
        mainEntity: {
          select: {
            id: true,
            name: true
          }
        },
        subEntities: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            incomes: true
          }
        }
      }
    })

    return NextResponse.json(entity, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating entity:', error)
    return NextResponse.json(
      { error: 'Failed to create entity' },
      { status: 500 }
    )
  }
}