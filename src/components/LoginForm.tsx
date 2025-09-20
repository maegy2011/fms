'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

const loginSchema = z.object({
  identifier: z.string().min(1, 'اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
})

const registerSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  name: z.string().min(1, 'الاسم الكامل مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  securityQuestion: z.string().min(1, 'سؤال الأمان مطلوب'),
  securityAnswer: z.string().min(1, 'إجابة الأمان مطلوبة')
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

interface AuthFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: (user: any) => void
}

export function LoginForm({ open, onOpenChange, onLoginSuccess }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true)
    console.log('🔍 Attempting login with:', data)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('📡 Response status:', response.status)
      const result = await response.json()
      console.log('📦 Response data:', result)

      if (response.ok) {
        if (result.user.isApproved) {
          toast.success('✅ تم تسجيل الدخول بنجاح! مرحباً بك في نظام الإدارة المالية')
        } else {
          toast.warning('⏳ تم تسجيل الدخول ولكن حسابك قيد المراجعة', {
            description: 'يرجى التواصل مع الأدمن لتفعيل حسابك',
            duration: 5000
          })
        }
        // Store token in localStorage
        localStorage.setItem('authToken', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        onLoginSuccess(result.user)
        onOpenChange(false)
        loginForm.reset()
      } else {
        if (result.error.includes('مفعل') || result.error.includes('غير مفعل')) {
          toast.error('🚫 حسابك غير مفعل بعد', {
            description: result.error + ' - يرجى التواصل مع الأدمن',
            duration: 5000
          })
        } else if (result.error.includes('بيانات الاعتماد')) {
          toast.error('🚫 بيانات الاعتماد غير صحيحة', {
            description: 'يرجى التحقق من اسم المستخدم وكلمة المرور',
            duration: 4000
          })
        } else {
          toast.error('❌ فشل تسجيل الدخول', {
            description: result.error || 'يرجى المحاولة مرة أخرى',
            duration: 4000
          })
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      toast.error('❌ حدث خطأ غير متوقع', {
        description: 'يرجى المحاولة مرة أخرى بعد قليل',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = data
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registerData,
          securityQuestion: {
            question: data.securityQuestion,
            answer: data.securityAnswer
          }
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('✅ تم إنشاء الحساب بنجاح!', {
          description: '⏳ حسابك الآن قيد المراجعة من قبل الأدمن',
          duration: 6000
        })
        
        setTimeout(() => {
          toast.info('📋 بيانات الاعتماد للدخول:', {
            description: `👤 اسم المستخدم: ${registerData.username}\n🔐 كلمة المرور: ${data.password}`,
            duration: 8000
          })
        }, 1000)
        
        registerForm.reset()
        // Switch to login tab
        setTimeout(() => {
          document.querySelector('[value="login"]')?.setAttribute('data-state', 'active')
        }, 2000)
      } else {
        if (result.error.includes('موجود بالفعل')) {
          toast.error('🚫 بيانات مكررة', {
            description: result.error,
            duration: 5000
          })
        } else if (result.error.includes('التحقق من البيانات')) {
          toast.error('❌ خطأ في البيانات', {
            description: 'يرجى التحقق من جميع الحقول المطلوبة',
            duration: 4000
          })
        } else {
          toast.error('❌ فشل إنشاء الحساب', {
            description: result.error || 'يرجى المحاولة مرة أخرى',
            duration: 4000
          })
        }
      }
    } catch (error) {
      toast.error('❌ حدث خطأ غير متوقع', {
        description: 'يرجى المحاولة مرة أخرى بعد قليل',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">تسجيل الدخول / إنشاء حساب جديد</DialogTitle>
          <DialogDescription className="text-center">
            قم بتسجيل الدخول إلى حسابك أو إنشاء حساب جديد لاستخدام النظام
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle className="text-lg">تسجيل الدخول</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data) => {
                    console.log('📝 Form submitted with data:', data)
                    handleLogin(data)
                  })} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="أدخل اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="أدخل كلمة المرور"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle className="text-lg">إنشاء حساب جديد</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="اسم المستخدم"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الكامل *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الكامل"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="email"
                                  placeholder="البريد الإلكتروني"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="رقم الهاتف"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="كلمة المرور"
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تأكيد كلمة المرور *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  placeholder="تأكيد كلمة المرور"
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="securityQuestion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سؤال الأمان *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: ما هي مدينتك المفضلة؟"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="securityAnswer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>إجابة الأمان *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="إجابة سؤال الأمان"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-sm text-muted-foreground">
                      <p>حقول مطلوبة *</p>
                      <p className="mt-2">
                        <Badge variant="secondary">ملاحظة:</Badge> سيتم مراجعة حسابك من قبل الأدمن قبل التفعيل
                      </p>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-medium text-blue-800 mb-2">🔐 معلومات حساب Administrator:</p>
                        <p className="text-blue-700 text-xs">اسم المستخدم: <span className="font-mono">admin</span></p>
                        <p className="text-blue-700 text-xs">كلمة المرور: <span className="font-mono">admin123</span></p>
                        <p className="text-blue-700 text-xs mt-1">يمكنك استخدام هذه البيانات لتسجيل الدخول كأدمن</p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}