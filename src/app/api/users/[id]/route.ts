import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/users/[id] - Update user (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { isActive, isApproved, role } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(isApproved !== undefined && { isApproved }),
        ...(role && { role })
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
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث المستخدم' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Delete security question first
    await db.securityQuestion.deleteMany({
      where: { userId: id }
    })

    // Delete user
    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'تم حذف المستخدم بنجاح' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'فشل في حذف المستخدم' },
      { status: 500 }
    )
  }
}