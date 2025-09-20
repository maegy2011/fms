'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { Building2, TrendingUp, PieChart as PieChartIcon } from 'lucide-react'

interface EntityData {
  name: string
  mainEntity?: string
  province: string
  totalIncome: number
  averageAmount: number
  percentage: number
  incomeCount: number
}

interface EntityAnalysisProps {
  entities: EntityData[]
  monthlyData: { month: string; amount: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function EntityAnalysis({ entities, monthlyData }: EntityAnalysisProps) {
  // Prepare data for bar chart (top 5 entities)
  const barChartData = entities
    .sort((a, b) => b.totalIncome - a.totalIncome)
    .slice(0, 5)
    .map(entity => ({
      name: entity.name,
      income: entity.totalIncome,
      province: entity.province
    }))

  // Prepare data for pie chart
  const pieChartData = entities
    .sort((a, b) => b.totalIncome - a.totalIncome)
    .slice(0, 6)
    .map(entity => ({
      name: entity.name,
      value: entity.totalIncome,
      percentage: entity.percentage
    }))

  // Calculate total income for percentage display
  const totalIncome = entities.reduce((sum, entity) => sum + entity.totalIncome, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الجهات</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entities.length}</div>
            <p className="text-xs text-muted-foreground">جهة مصدرة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ر.س {totalIncome.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">من جميع الجهات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الإيراد</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ر.س {entities.length > 0 ? Math.round(totalIncome / entities.length).toLocaleString('ar-SA') : 0}
            </div>
            <p className="text-xs text-muted-foreground">متوسط لكل جهة</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Top Entities */}
        <Card>
          <CardHeader>
            <CardTitle>أعلى 5 جهات إيراداً</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `ر.س ${value.toLocaleString('ar-SA')}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`ر.س ${value.toLocaleString('ar-SA')}`, 'الإيراد']}
                  labelFormatter={(label) => `الجهة: ${label}`}
                />
                <Bar dataKey="income" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Income Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الإيرادات حسب الجهات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`ر.س ${value.toLocaleString('ar-SA')}`, 'الإيراد']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Income Chart */}
      <Card>
        <CardHeader>
          <CardTitle>إجمالي الإيرادات حسب الشهر</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `ر.س ${value.toLocaleString('ar-SA')}`}
              />
              <Tooltip 
                formatter={(value: number) => [`ر.س ${value.toLocaleString('ar-SA')}`, 'الإيراد']}
              />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Entity Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الجهات المصدرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الجهة</TableHead>
                  <TableHead>الجهة الرئيسية</TableHead>
                  <TableHead>المحافظة</TableHead>
                  <TableHead>إجمالي الإيرادات</TableHead>
                  <TableHead>متوسط المبلغ</TableHead>
                  <TableHead>النسبة المئوية</TableHead>
                  <TableHead>عدد الإيرادات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities
                  .sort((a, b) => b.totalIncome - a.totalIncome)
                  .map((entity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entity.name}</TableCell>
                      <TableCell>{entity.mainEntity || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entity.province}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ر.س {entity.totalIncome.toLocaleString('ar-SA')}
                      </TableCell>
                      <TableCell>ر.س {entity.averageAmount.toLocaleString('ar-SA')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${entity.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{entity.percentage.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{entity.incomeCount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}