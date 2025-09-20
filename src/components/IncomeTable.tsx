'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

interface Income {
  id: string
  amount: number
  dueDate: string
  entityName: string
  month: number
  year: number
  type: string
  description?: string
  gpNumber?: string
  province: string
}

interface IncomeTableProps {
  incomes: Income[]
  onEditIncome?: (income: Income) => void
  onDeleteIncome?: (id: string) => void
}

const incomeTypeLabels = {
  SUBSCRIPTION: 'اشتراكات',
  LEGAL_FEES: 'اتعاب محاماة',
  PENALTIES: 'جزاءات',
  AUTOMATION: 'ميكنة',
  OTHER: 'أخرى'
}

const monthNames = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
]

export function IncomeTable({ incomes, onEditIncome, onDeleteIncome }: IncomeTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEntity, setFilterEntity] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortField, setSortField] = useState<'amount' | 'dueDate' | 'entityName'>('dueDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Get unique entities and types for filters
  const entities = [...new Set(incomes.map(income => income.entityName))]
  const types = [...new Set(incomes.map(income => income.type))]

  // Filter and sort incomes
  const filteredIncomes = incomes
    .filter(income => {
      const matchesSearch = searchTerm === '' || 
        income.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.gpNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesEntity = filterEntity === '' || filterEntity === 'all' || income.entityName === filterEntity
      const matchesType = filterType === '' || filterType === 'all' || income.type === filterType
      
      return matchesSearch && matchesEntity && matchesType
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortField) {
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'dueDate':
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case 'entityName':
          aValue = a.entityName
          bValue = b.entityName
          break
        default:
          aValue = a.dueDate
          bValue = b.dueDate
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleSort = (field: 'amount' | 'dueDate' | 'entityName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          قائمة الإيرادات الشهرية
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالجهة، الوصف، أو رقم GP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterEntity || undefined} onValueChange={setFilterEntity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الجهة المصدرة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الجهات</SelectItem>
              {entities.map(entity => (
                <SelectItem key={entity} value={entity}>{entity}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterType || undefined} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="نوع الإيراد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{incomeTypeLabels[type as keyof typeof incomeTypeLabels]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('dueDate')}
                >
                  تاريخ الاستحقاق
                  <ArrowUpDown className="inline h-3 w-3 mr-1" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('entityName')}
                >
                  الجهة المصدرة
                  <ArrowUpDown className="inline h-3 w-3 mr-1" />
                </TableHead>
                <TableHead>الشهر</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('amount')}
                >
                  المبلغ
                  <ArrowUpDown className="inline h-3 w-3 mr-1" />
                </TableHead>
                <TableHead>نوع الإيراد</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>رقم GP</TableHead>
                <TableHead>المحافظة</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomes.map((income, index) => (
                <TableRow key={income.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{new Date(income.dueDate).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell className="font-medium">{income.entityName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {monthNames[income.month - 1]} {income.year}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">ر.س {income.amount.toLocaleString('ar-SA')}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {incomeTypeLabels[income.type as keyof typeof incomeTypeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{income.description || '-'}</TableCell>
                  <TableCell>{income.gpNumber || '-'}</TableCell>
                  <TableCell>{income.province}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {onEditIncome && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditIncome(income)}
                        >
                          تعديل
                        </Button>
                      )}
                      {onDeleteIncome && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onDeleteIncome(income.id)}
                        >
                          حذف
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredIncomes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد إيرادات مطابقة للبحث
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}