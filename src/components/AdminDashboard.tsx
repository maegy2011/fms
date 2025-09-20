'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
  phone: string
  name: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  isApproved: boolean
  createdAt: string
  securityQuestion?: {
    question: string
  }
  _count: {
    incomes: number
  }
}

interface AdminDashboardProps {
  onClose: () => void
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        console.log('✅ Users loaded:', data.length)
      } else {
        toast.error('فشل في جلب بيانات المستخدمين')
        console.error('❌ Failed to fetch users')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين')
      console.error('❌ Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId: string, updates: any) => {
    setUpdating(userId)
    try {
      console.log('🔄 Updating user:', userId, updates)
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map(user => 
          user.id === userId ? updatedUser : user
        ))
        toast.success('✅ تم تحديث بيانات المستخدم بنجاح')
        console.log('✅ User updated successfully:', updatedUser)
      } else {
        const error = await response.json()
        toast.error('❌ فشل في تحديث بيانات المستخدم')
        console.error('❌ Failed to update user:', error)
      }
    } catch (error) {
      toast.error('❌ حدث خطأ أثناء تحديث بيانات المستخدم')
      console.error('❌ Error updating user:', error)
    } finally {
      setUpdating(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return
    }

    try {
      console.log('🗑️ Deleting user:', userId)
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
        toast.success('✅ تم حذف المستخدم بنجاح')
        console.log('✅ User deleted successfully')
      } else {
        const error = await response.json()
        toast.error('❌ فشل في حذف المستخدم')
        console.error('❌ Failed to delete user:', error)
      }
    } catch (error) {
      toast.error('❌ حدث خطأ أثناء حذف المستخدم')
      console.error('❌ Error deleting user:', error)
    }
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    approved: users.filter(u => u.isApproved).length,
    pending: users.filter(u => !u.isApproved).length,
    admins: users.filter(u => u.role === 'ADMIN').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">لوحة تحكم الأدمن</h2>
          <p className="text-muted-foreground">إدارة المستخدمين والصلاحيات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium leading-tight">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium leading-tight">المستخدمون النشطون</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium leading-tight">المستخدمون المفعّلون</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium leading-tight">في الانتظار</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium leading-tight">المدراء</CardTitle>
            <Shield className="h-4 w-4 text-purple-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">المستخدم</TableHead>
                  <TableHead className="min-w-[150px] hidden sm:table-cell">البريد الإلكتروني</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">الهاتف</TableHead>
                  <TableHead className="min-w-[80px]">الدور</TableHead>
                  <TableHead className="min-w-[80px]">الحالة</TableHead>
                  <TableHead className="min-w-[80px]">التفعيل</TableHead>
                  <TableHead className="min-w-[60px] text-center">الإيرادات</TableHead>
                  <TableHead className="min-w-[80px] hidden lg:table-cell">تاريخ الإنشاء</TableHead>
                  <TableHead className="min-w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => updateUser(user.id, { role: value as 'USER' | 'ADMIN' })}
                        disabled={updating === user.id}
                      >
                        <SelectTrigger className="w-20 sm:w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">مستخدم</SelectItem>
                          <SelectItem value="ADMIN">أدمن</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isApproved ? "default" : "secondary"}>
                        {user.isApproved ? "مفعّل" : "قيد الانتظار"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => updateUser(user.id, { isActive: checked })}
                        disabled={updating === user.id}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>{user._count.incomes}</span>
                        {user._count.incomes > 0 && (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUser(user.id, { isApproved: !user.isApproved })}
                          disabled={updating === user.id}
                          title={user.isApproved ? "إلغاء التفعيل" : "تفعيل"}
                        >
                          {user.isApproved ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          disabled={updating === user.id}
                          title="حذف"
                        >
                          <span className="hidden sm:inline">حذف</span>
                          <span className="sm:hidden">×</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا يوجد مستخدمين لعرضهم
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}