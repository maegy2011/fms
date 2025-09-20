import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/incomes/[id] - Update income
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { amount, dueDate, entityId, month, year, type, description, gpNumber } = body

    // Check if income exists
    const existingIncome = await db.income.findUnique({
      where: { id },
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

    if (!existingIncome) {
      return NextResponse.json(
        { error: 'الإيراد غير موجود' },
        { status: 404 }
      )
    }

    // Check if entity exists if entityId is provided
    if (entityId) {
      const entity = await db.entity.findUnique({
        where: { id: entityId }
      })

      if (!entity) {
        return NextResponse.json(
          { error: 'الجهة غير موجودة' },
          { status: 404 }
        )
      }
    }

    // Update income
    const updatedIncome = await db.income.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(entityId && { entityId }),
        ...(month !== undefined && { month }),
        ...(year !== undefined && { year }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(gpNumber !== undefined && { gpNumber })
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

    return NextResponse.json(updatedIncome)
  } catch (error) {
    console.error('Error updating income:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الإيراد' },
      { status: 500 }
    )
  }
}

// DELETE /api/incomes/[id] - Delete income
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if income exists
    const existingIncome = await db.income.findUnique({
      where: { id }
    })

    if (!existingIncome) {
      return NextResponse.json(
        { error: 'الإيراد غير موجود' },
        { status: 404 }
      )
    }

    // Delete income
    await db.income.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'تم حذف الإيراد بنجاح' })
  } catch (error) {
    console.error('Error deleting income:', error)
    return NextResponse.json(
      { error: 'فشل في حذف الإيراد' },
      { status: 500 }
    )
  }
}