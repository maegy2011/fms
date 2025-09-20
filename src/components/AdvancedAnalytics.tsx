'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Scatter
} from 'recharts'
import { TrendingUp, TrendingDown, Target, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'

interface AnalyticsData {
  monthlyTrend: Array<{
    month: string
    income: number
    growth: number
    count: number
  }>
  comparisonData: Array<{
    period: string
    current: number
    previous: number
    difference: number
    percentage: number
  }>
  typeAnalysis: Array<{
    type: string
    amount: number
    count: number
    growth: number
  }>
  provinceAnalysis: Array<{
    province: string
    amount: number
    count: number
    average: number
  }>
  predictions: {
    nextMonth: number
    quarter: number
    year: number
    confidence: number
  }
}

export function AdvancedAnalytics({ data }: { data: AnalyticsData }) {
  const { monthlyTrend, comparisonData, typeAnalysis, provinceAnalysis, predictions } = data

  // Calculate overall trends
  const totalGrowth = monthlyTrend.length > 1 
    ? ((monthlyTrend[monthlyTrend.length - 1].income - monthlyTrend[0].income) / monthlyTrend[0].income) * 100
    : 0

  const isPositiveGrowth = totalGrowth > 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نمو الإيرادات</CardTitle>
            {isPositiveGrowth ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveGrowth ? '+' : ''}{totalGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">نمو إجمالي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">توقع الشهر القادم</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ر.س {predictions.nextMonth.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">
              بثقة {predictions.confidence}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الإيراد الشهري</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ر.س {Math.round(monthlyTrend.reduce((sum, item) => sum + item.income, 0) / monthlyTrend.length).toLocaleString('ar-SA')}
            </div>
            <p className="text-xs text-muted-foreground">متوسط الفترة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أعلى نمو</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...typeAnalysis.map(t => t.growth)).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">أعلى نمو بالنوع</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>اتجاه الإيرادات الشهرية (6 أشهر)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `ر.س ${value.toLocaleString('ar-SA')}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'income') return [`ر.س ${value.toLocaleString('ar-SA')}`, 'الإيراد']
                  if (name === 'growth') return [`${value.toFixed(1)}%`, 'النمو']
                  return [value, name]
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="income" fill="#8884d8" name="الإيراد" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="growth" 
                stroke="#82ca9d" 
                strokeWidth={3}
                name="النمو%"
                dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>مقارنة الفترات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `ر.س ${value.toLocaleString('ar-SA')}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`ر.س ${value.toLocaleString('ar-SA')}`, '']}
                />
                <Legend />
                <Bar dataKey="current" fill="#8884d8" name="الإيراد الحالي" />
                <Bar dataKey="previous" fill="#82ca9d" name="الإيراد السابق" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Type Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>تحليل أنواع الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={typeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `ر.س ${value.toLocaleString('ar-SA')}`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'amount') return [`ر.س ${value.toLocaleString('ar-SA')}`, 'الإيراد']
                    if (name === 'growth') return [`${value.toFixed(1)}%`, 'النمو']
                    return [value, name]
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  name="الإيراد"
                />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name="النمو%"
                  dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Province Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل الإيرادات حسب المحافظات</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={provinceAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="province" />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `ر.س ${value.toLocaleString('ar-SA')}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'amount') return [`ر.س ${value.toLocaleString('ar-SA')}`, 'الإيراد']
                  if (name === 'average') return [`ر.س ${value.toLocaleString('ar-SA')}`, 'المتوسط']
                  return [value, name]
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="إجمالي الإيراد" />
              <Bar dataKey="average" fill="#82ca9d" name="متوسط الإيراد" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictions and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">توقعات الربع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">ر.س {predictions.quarter.toLocaleString('ar-SA')}</div>
              <p className="text-sm text-muted-foreground">متوقع إجمالي الربع</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${predictions.confidence}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">مستوى الثقة: {predictions.confidence}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">توقعات السنة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">ر.س {predictions.year.toLocaleString('ar-SA')}</div>
              <p className="text-sm text-muted-foreground">متوقع إجمالي السنة</p>
              <Badge variant={isPositiveGrowth ? "default" : "destructive"}>
                {isPositiveGrowth ? 'نموي' : 'تراجعي'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أفضل أداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-semibold">
                {typeAnalysis.reduce((max, current) => 
                  current.amount > max.amount ? current : max
                ).type}
              </div>
              <p className="text-sm text-muted-foreground">أعلى نوع إيراد</p>
              <div className="text-xs text-green-600">
                +{Math.max(...typeAnalysis.map(t => t.growth)).toFixed(1)}% نمو
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}