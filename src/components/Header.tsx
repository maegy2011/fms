'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus, User } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface HeaderProps {
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onAddIncome: () => void
  userName?: string
}

export function Header({ currentMonth, onMonthChange, onAddIncome, userName }: HeaderProps) {
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-2">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <div className="text-center sm:text-right">
            <CardTitle className="text-lg sm:text-xl font-bold">نظام الإدارة المالية | FMS</CardTitle>
            {userName && (
              <p className="text-sm text-muted-foreground">مرحباً، {userName}</p>
            )}
          </div>
        </div>
        <Button onClick={onAddIncome} size="sm" className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">إضافة إيراد جديد</span>
          <span className="sm:hidden">إضافة</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="text-base sm:text-lg px-3 sm:px-4 py-2 text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: ar })}
            </Badge>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}