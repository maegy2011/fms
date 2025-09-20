'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Building2, DollarSign, Target, BarChart3 } from 'lucide-react'

interface DashboardProps {
  currentMonthIncome: number
  previousMonthIncome: number
  averageIncome: number
  topEntityThisMonth: string
  topEntityPreviousMonth: string
  predictedIncome: number
}

export function Dashboard({
  currentMonthIncome,
  previousMonthIncome,
  averageIncome,
  topEntityThisMonth,
  topEntityPreviousMonth,
  predictedIncome
}: DashboardProps) {
  const percentageChange = previousMonthIncome > 0 
    ? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome * 100).toFixed(1)
    : 0

  const isPositive = currentMonthIncome >= previousMonthIncome

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* ملخص الإيرادات */}
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium leading-tight">إجمالي الإيرادات الشهرية الحالية</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">ر.س {currentMonthIncome.toLocaleString('ar-SA')}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositive ? (
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{Math.abs(Number(percentageChange))}%
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                -{Math.abs(Number(percentageChange))}%
              </span>
            )}
            عن الشهر الماضي
          </p>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium leading-tight">إجمالي الإيرادات الشهر الماضي</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">ر.س {previousMonthIncome.toLocaleString('ar-SA')}</div>
          <p className="text-xs text-muted-foreground mt-1">الشهر السابق</p>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium leading-tight">متوسط الإيرادات الشهرية</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">ر.س {averageIncome.toLocaleString('ar-SA')}</div>
          <p className="text-xs text-muted-foreground mt-1">متوسط الشهور السابقة</p>
        </CardContent>
      </Card>

      {/* أهم المؤشرات */}
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium leading-tight">الجهة الأكثر إيراداً هذا الشهر</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-base sm:text-lg font-semibold">{topEntityThisMonth || 'لا يوجد'}</div>
          <p className="text-xs text-muted-foreground mt-1">أعلى إيراد هذا الشهر</p>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium leading-tight">الجهة الأكثر إيراداً الشهر الماضي</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-base sm:text-lg font-semibold">{topEntityPreviousMonth || 'لا يوجد'}</div>
          <p className="text-xs text-muted-foreground mt-1">أعلى إيراد الشهر الماضي</p>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium leading-tight">توقع الإيرادات الشهرية</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">ر.س {predictedIncome.toLocaleString('ar-SA')}</div>
          <p className="text-xs text-muted-foreground mt-1">بناءً على المتوسط</p>
        </CardContent>
      </Card>
    </div>
  )
}