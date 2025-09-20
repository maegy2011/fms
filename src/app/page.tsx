'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Dashboard } from '@/components/Dashboard'
import { IncomeTable } from '@/components/IncomeTable'
import { AddIncomeForm } from '@/components/AddIncomeForm'
import { EntityAnalysis } from '@/components/EntityAnalysis'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { LoginForm } from '@/components/LoginForm'
import { AdminDashboard } from '@/components/AdminDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { LogOut, User, Shield, Settings } from 'lucide-react'

// Mock data for now - will be replaced with API calls
const mockIncomes = [
  {
    id: '1',
    amount: 15000,
    dueDate: '2024-01-15',
    entityName: 'وزارة التجارة',
    month: 1,
    year: 2024,
    type: 'SUBSCRIPTION',
    description: 'اشتراكات شهرية',
    gpNumber: 'GP-2024-001',
    province: 'الرياض'
  },
  {
    id: '2',
    amount: 25000,
    dueDate: '2024-01-20',
    entityName: 'شركة الاتصالات',
    month: 1,
    year: 2024,
    type: 'LEGAL_FEES',
    description: 'اتعاب محاماة',
    gpNumber: 'GP-2024-002',
    province: 'جدة'
  },
  {
    id: '3',
    amount: 8000,
    dueDate: '2024-01-25',
    entityName: 'البنك الأهلي',
    month: 1,
    year: 2024,
    type: 'PENALTIES',
    description: 'جزاءات تأخير',
    gpNumber: 'GP-2024-003',
    province: 'الدمام'
  },
  {
    id: '4',
    amount: 12000,
    dueDate: '2024-02-10',
    entityName: 'وزارة التجارة',
    month: 2,
    year: 2024,
    type: 'SUBSCRIPTION',
    description: 'اشتراكات شهرية',
    gpNumber: 'GP-2024-004',
    province: 'الرياض'
  },
  {
    id: '5',
    amount: 18000,
    dueDate: '2024-02-15',
    entityName: 'شركة الاتصالات',
    month: 2,
    year: 2024,
    type: 'LEGAL_FEES',
    description: 'اتعاب محاماة',
    gpNumber: 'GP-2024-005',
    province: 'جدة'
  },
  {
    id: '6',
    amount: 22000,
    dueDate: '2024-03-10',
    entityName: 'وزارة التجارة',
    month: 3,
    year: 2024,
    type: 'SUBSCRIPTION',
    description: 'اشتراكات شهرية',
    gpNumber: 'GP-2024-006',
    province: 'الرياض'
  },
  {
    id: '7',
    amount: 28000,
    dueDate: '2024-03-15',
    entityName: 'شركة الاتصالات',
    month: 3,
    year: 2024,
    type: 'LEGAL_FEES',
    description: 'اتعاب محاماة',
    gpNumber: 'GP-2024-007',
    province: 'جدة'
  },
  {
    id: '8',
    amount: 15000,
    dueDate: '2024-04-10',
    entityName: 'وزارة التجارة',
    month: 4,
    year: 2024,
    type: 'SUBSCRIPTION',
    description: 'اشتراكات شهرية',
    gpNumber: 'GP-2024-008',
    province: 'الرياض'
  },
  {
    id: '9',
    amount: 32000,
    dueDate: '2024-04-15',
    entityName: 'شركة الاتصالات',
    month: 4,
    year: 2024,
    type: 'LEGAL_FEES',
    description: 'اتعاب محاماة',
    gpNumber: 'GP-2024-009',
    province: 'جدة'
  }
]

const mockEntities = [
  { id: '1', name: 'وزارة التجارة', province: 'الرياض' },
  { id: '2', name: 'شركة الاتصالات', province: 'جدة' },
  { id: '3', name: 'البنك الأهلي', province: 'الدمام' },
  { id: '4', name: 'شركة الكهرباء', province: 'الرياض' },
  { id: '5', name: 'وزارة الصحة', province: 'مكة' }
]

// Calculate entity analysis data
const calculateEntityData = (incomes: any[]) => {
  const entityMap = new Map()
  
  incomes.forEach(income => {
    if (!entityMap.has(income.entityName)) {
      entityMap.set(income.entityName, {
        name: income.entityName,
        province: income.province,
        totalIncome: 0,
        incomeCount: 0,
        amounts: []
      })
    }
    
    const entity = entityMap.get(income.entityName)
    entity.totalIncome += income.amount
    entity.incomeCount += 1
    entity.amounts.push(income.amount)
  })
  
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  
  return Array.from(entityMap.values()).map(entity => ({
    ...entity,
    averageAmount: entity.totalIncome / entity.incomeCount,
    percentage: (entity.totalIncome / totalIncome) * 100
  }))
}

// Calculate monthly data
const calculateMonthlyData = (incomes: any[]) => {
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  const monthlyMap = new Map()
  
  incomes.forEach(income => {
    const monthKey = `${income.year}-${income.month.toString().padStart(2, '0')}`
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthNames[income.month - 1],
        amount: 0
      })
    }
    
    monthlyMap.get(monthKey).amount += income.amount
  })
  
  return Array.from(monthlyMap.values())
}

// Calculate advanced analytics data
const calculateAdvancedAnalytics = (incomes: any[]) => {
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
  
  // Monthly trend data
  const monthlyTrend = monthNames.map((month, index) => {
    const monthIncomes = incomes.filter(income => income.month === index + 1)
    const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0)
    const prevMonthIncome = index > 0 
      ? incomes.filter(income => income.month === index).reduce((sum, income) => sum + income.amount, 0)
      : 0
    const growth = prevMonthIncome > 0 ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100 : 0
    
    return {
      month,
      income: totalIncome,
      growth,
      count: monthIncomes.length
    }
  })

  // Type analysis
  const typeMap = new Map()
  incomes.forEach(income => {
    if (!typeMap.has(income.type)) {
      typeMap.set(income.type, {
        type: income.type,
        amount: 0,
        count: 0,
        amounts: []
      })
    }
    const typeData = typeMap.get(income.type)
    typeData.amount += income.amount
    typeData.count += 1
    typeData.amounts.push(income.amount)
  })

  const typeAnalysis = Array.from(typeMap.values()).map(typeData => {
    const avgAmount = typeData.amount / typeData.count
    const growth = Math.random() * 40 - 10 // Mock growth data
    return {
      type: typeData.type === 'SUBSCRIPTION' ? 'اشتراكات' :
             typeData.type === 'LEGAL_FEES' ? 'اتعاب محاماة' :
             typeData.type === 'PENALTIES' ? 'جزاءات' :
             typeData.type === 'AUTOMATION' ? 'ميكنة' : 'أخرى',
      amount: typeData.amount,
      count: typeData.count,
      growth
    }
  })

  // Province analysis
  const provinceMap = new Map()
  incomes.forEach(income => {
    if (!provinceMap.has(income.province)) {
      provinceMap.set(income.province, {
        province: income.province,
        amount: 0,
        count: 0
      })
    }
    const provinceData = provinceMap.get(income.province)
    provinceData.amount += income.amount
    provinceData.count += 1
  })

  const provinceAnalysis = Array.from(provinceMap.values()).map(provinceData => ({
    ...provinceData,
    average: provinceData.amount / provinceData.count
  }))

  // Comparison data
  const comparisonData = [
    {
      period: 'الشهر الحالي',
      current: incomes.filter(i => i.month === 4).reduce((sum, income) => sum + income.amount, 0),
      previous: incomes.filter(i => i.month === 3).reduce((sum, income) => sum + income.amount, 0),
      difference: 0,
      percentage: 0
    },
    {
      period: 'الشهر الماضي',
      current: incomes.filter(i => i.month === 3).reduce((sum, income) => sum + income.amount, 0),
      previous: incomes.filter(i => i.month === 2).reduce((sum, income) => sum + income.amount, 0),
      difference: 0,
      percentage: 0
    }
  ].map(item => ({
    ...item,
    difference: item.current - item.previous,
    percentage: item.previous > 0 ? ((item.current - item.previous) / item.previous) * 100 : 0
  }))

  // Predictions
  const avgMonthlyIncome = incomes.reduce((sum, income) => sum + income.amount, 0) / 4
  const predictions = {
    nextMonth: Math.round(avgMonthlyIncome * 1.1),
    quarter: Math.round(avgMonthlyIncome * 3 * 1.05),
    year: Math.round(avgMonthlyIncome * 12 * 1.08),
    confidence: 85
  }

  return {
    monthlyTrend,
    comparisonData,
    typeAnalysis,
    provinceAnalysis,
    predictions
  }
}

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [incomes, setIncomes] = useState(mockIncomes)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }

    // Simulate loading data
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date)
    // Here you would fetch data for the selected month
  }

  const handleAddIncome = () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً')
      setShowLogin(true)
      return
    }
    setShowAddIncome(true)
  }

  const handleSubmitIncome = (data: any) => {
    // Create new income object
    const newIncome = {
      id: Date.now().toString(),
      amount: parseFloat(data.amount),
      dueDate: data.dueDate.toISOString().split('T')[0],
      entityName: mockEntities.find(e => e.id === data.entityId)?.name || '',
      month: parseInt(data.month),
      year: new Date().getFullYear(),
      type: data.type,
      description: data.description || '',
      gpNumber: data.gpNumber || '',
      province: mockEntities.find(e => e.id === data.entityId)?.province || ''
    }

    // Add to incomes array
    setIncomes([...incomes, newIncome])
    
    // Show success message
    toast.success('تمت إضافة الإيراد بنجاح')
  }

  const handleEditIncome = (income: any) => {
    console.log('Edit income:', income)
    // TODO: Implement edit functionality
  }

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter(income => income.id !== id))
    toast.success('تم حذف الإيراد بنجاح')
  }

  const handleLoginSuccess = (loggedInUser: any) => {
    console.log('✅ Login success callback triggered with user:', loggedInUser)
    setUser(loggedInUser)
    toast.success(`مرحباً، ${loggedInUser.name}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    setUser(null)
    toast.success('تم تسجيل الخروج بنجاح')
  }

  // Calculate dashboard data
  const currentMonthIncome = incomes
    .filter(income => income.month === currentMonth.getMonth() + 1)
    .reduce((sum, income) => sum + income.amount, 0)

  const previousMonthIncome = 18500 // Mock data
  const averageIncome = 20000 // Mock data
  const topEntityThisMonth = 'وزارة التجارة' // Mock data
  const topEntityPreviousMonth = 'شركة الاتصالات' // Mock data
  const predictedIncome = 22000 // Mock data

  // Calculate analysis data
  const entityData = calculateEntityData(incomes)
  const monthlyData = calculateMonthlyData(incomes)
  const advancedAnalytics = calculateAdvancedAnalytics(incomes)

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">نظام الإدارة المالية | FMS</CardTitle>
            <p className="text-muted-foreground">نظام متخصص لتتبع وتحليل الإيرادات الشهرية</p>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">🌐 رابط التطبيق:</p>
              <p className="text-xs text-blue-700 font-mono bg-white p-2 rounded mt-1">http://0.0.0.0:3000</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">مميزات النظام:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• تتبع الإيرادات الشهرية من مصادر متعددة</li>
                <li>• تحليل الجهات المصدرة للإيرادات</li>
                <li>• رسوم بيانية وتقارير مفصلة</li>
                <li>• نظام تصفية وفرز متقدم</li>
                <li>• واجهة مستخدم سهلة الاستخدام</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium text-sm">🔐 بيانات Administrator:</p>
              <p className="text-green-700 text-xs">اسم المستخدم: <span className="font-mono">admin</span></p>
              <p className="text-green-700 text-xs">كلمة المرور: <span className="font-mono">admin123</span></p>
            </div>
            <Button 
              onClick={() => setShowLogin(true)} 
              className="w-full"
              size="lg"
            >
              تسجيل الدخول أو إنشاء حساب جديد
            </Button>
          </CardContent>
        </Card>
        
        <LoginForm 
          open={showLogin}
          onOpenChange={setShowLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* User info bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="font-medium">مرحباً، {user.name}</span>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {user.isApproved ? (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                ✅ حساب مفعل
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                ⏳ قيد الانتظار
              </Badge>
            )}
            {user.isActive ? (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                🟢 نشط
              </Badge>
            ) : (
              <Badge variant="destructive">
                🔴 غير نشط
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {user.role === 'ADMIN' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdmin(true)}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              لوحة الأدمن
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Account Status Message */}
      {!user.isApproved && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-yellow-600 rounded-full animate-pulse"></div>
              <p className="text-yellow-800 font-medium">
                ⏳ حسابك قيد المراجعة من قبل الأدمن
              </p>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              سيتم إعلامك عند تفعيل حسابك. يمكنك تسجيل الدخول ولكن بعض الميزات قد تكون محدودة.
            </p>
          </CardContent>
        </Card>
      )}

      <Header 
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onAddIncome={handleAddIncome}
        userName={user.name}
      />

      <Dashboard
        currentMonthIncome={currentMonthIncome}
        previousMonthIncome={previousMonthIncome}
        averageIncome={averageIncome}
        topEntityThisMonth={topEntityThisMonth}
        topEntityPreviousMonth={topEntityPreviousMonth}
        predictedIncome={predictedIncome}
      />

      <Tabs defaultValue="incomes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incomes">الإيرادات الشهرية</TabsTrigger>
          <TabsTrigger value="entities">الجهات المصدرة</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="incomes">
          <IncomeTable 
            incomes={incomes}
            onEditIncome={handleEditIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        </TabsContent>

        <TabsContent value="entities">
          <EntityAnalysis 
            entities={entityData}
            monthlyData={monthlyData}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalytics data={advancedAnalytics} />
        </TabsContent>
      </Tabs>

      <AddIncomeForm
        open={showAddIncome}
        onOpenChange={setShowAddIncome}
        onSubmit={handleSubmitIncome}
        entities={mockEntities}
      />

      <LoginForm 
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={handleLoginSuccess}
      />

      <Dialog open={showAdmin} onOpenChange={setShowAdmin}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              لوحة تحكم الأدمن
            </DialogTitle>
          </DialogHeader>
          <AdminDashboard onClose={() => setShowAdmin(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}