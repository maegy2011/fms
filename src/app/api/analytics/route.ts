import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Get entity analytics
    const entityAnalytics = await db.income.groupBy({
      by: ['entityId'],
      _sum: {
        amount: true
      },
      _count: {
        _all: true
      },
      _avg: {
        amount: true
      },
      where: {
        year: parseInt(year)
      }
    })

    // Get entity details
    const entityDetails = await Promise.all(
      entityAnalytics.map(async (item) => {
        const entity = await db.entity.findUnique({
          where: { id: item.entityId },
          select: {
            id: true,
            name: true,
            province: true,
            mainEntity: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
        return {
          ...item,
          entity
        }
      })
    )

    // Get monthly analytics
    const monthlyAnalytics = await db.income.groupBy({
      by: ['month'],
      _sum: {
        amount: true
      },
      _count: {
        _all: true
      },
      where: {
        year: parseInt(year)
      },
      orderBy: {
        month: 'asc'
      }
    })

    // Get income type analytics
    const typeAnalytics = await db.income.groupBy({
      by: ['type'],
      _sum: {
        amount: true
      },
      _count: {
        _all: true
      },
      where: {
        year: parseInt(year)
      }
    })

    // Get province analytics
    const provinceAnalytics = await db.income.groupBy({
      by: ['entityId'],
      _sum: {
        amount: true
      },
      where: {
        year: parseInt(year)
      }
    })

    // Get province details
    const provinceDetails = await Promise.all(
      provinceAnalytics.map(async (item) => {
        const entity = await db.entity.findUnique({
          where: { id: item.entityId },
          select: {
            province: true
          }
        })
        return {
          province: entity?.province || 'Unknown',
          amount: item._sum.amount || 0
        }
      })
    )

    // Group by province
    const provinceGrouped = provinceDetails.reduce((acc, item) => {
      const existing = acc.find(a => a.province === item.province)
      if (existing) {
        existing.amount += item.amount
      } else {
        acc.push(item)
      }
      return acc
    }, [] as Array<{ province: string; amount: number }>)

    // Calculate totals
    const totalIncome = entityAnalytics.reduce((sum, item) => sum + (item._sum.amount || 0), 0)
    const totalCount = entityAnalytics.reduce((sum, item) => sum + item._count._all, 0)

    // Calculate percentages for entities
    const entityWithPercentages = entityDetails.map(item => ({
      ...item,
      percentage: totalIncome > 0 ? ((item._sum.amount || 0) / totalIncome) * 100 : 0
    }))

    // Month names in Arabic
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

    // Format monthly data with month names
    const monthlyData = monthlyAnalytics.map(item => ({
      month: monthNames[item.month - 1],
      amount: item._sum.amount || 0,
      count: item._count._all
    }))

    // Format type data with Arabic labels
    const typeLabels = {
      SUBSCRIPTION: 'اشتراكات',
      LEGAL_FEES: 'اتعاب محاماة',
      PENALTIES: 'جزاءات',
      AUTOMATION: 'ميكنة',
      OTHER: 'أخرى'
    }

    const typeData = typeAnalytics.map(item => ({
      type: typeLabels[item.type as keyof typeof typeLabels] || item.type,
      amount: item._sum.amount || 0,
      count: item._count._all
    }))

    return NextResponse.json({
      entities: entityWithPercentages,
      monthly: monthlyData,
      types: typeData,
      provinces: provinceGrouped,
      totals: {
        income: totalIncome,
        count: totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}