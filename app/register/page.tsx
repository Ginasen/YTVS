"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Mail, Lock, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [agreeOfferTerms, setAgreeOfferTerms] = useState(false)
  const [agreePrivacyPolicy, setAgreePrivacyPolicy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const validatePassword = (pwd: string) => {
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(pwd)
    const hasDigit = /[0-9]/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

    if (pwd.length < minLength) {
      return `Пароль должен быть не менее ${minLength} символов.`
    }
    if (!hasUppercase) {
      return "Пароль должен содержать хотя бы одну заглавную букву."
    }
    if (!hasDigit) {
      return "Пароль должен содержать хотя бы одну цифру."
    }
    if (!hasSpecialChar) {
      return "Пароль должен содержать хотя бы один специальный символ (!@#$%^&*(),.?\":{}|<>)."
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setError("Пожалуйста, заполните все поля.")
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (!agreeOfferTerms) {
      setError("Вы должны принять условия оферты.")
      return
    }

    if (!agreePrivacyPolicy) {
      setError("Вы должны ознакомиться с политикой конфиденциальности.")
      return
    }

    setLoading(true)

    const userData = {
      full_name: name,
      phone_number: phone,
    }
    console.log("Sending user data to Supabase:", userData)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    setLoading(false)
    console.log("Supabase signUp response data:", data)
    console.log("Supabase signUp error:", signUpError)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.user) {
      setSuccess("Регистрация прошла успешно! Проверьте свою почту для подтверждения.")
      setName("")
      setEmail("")
      setPassword("")
      setPhone("")
      setAgreeOfferTerms(false)
      setAgreePrivacyPolicy(false)
      router.push("/login") // Redirect to login page after successful registration
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center psychedelic-bg floating-orbs relative overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="morph-shape-1" />
        <div className="morph-shape-2" />
      </div>

      <Card className="w-full max-w-md glow-card electric-border bg-card/70 backdrop-blur-md relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold neon-text mb-2 text-balance bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Регистрация
          </CardTitle>
          <CardDescription className="text-lg text-foreground/70">
            Создайте свой аккаунт, чтобы начать
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Имя</Label>
              <div className="relative mt-1">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 text-lg py-6 bg-input/40 backdrop-blur-sm border border-primary/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ваша@почта.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-lg py-6 bg-input/40 backdrop-blur-sm border border-primary/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-lg py-6 bg-input/40 backdrop-blur-sm border border-primary/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Номер телефона</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 text-lg py-6 bg-input/40 backdrop-blur-sm border border-primary/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="offer-terms"
                checked={agreeOfferTerms}
                onCheckedChange={(checked) => setAgreeOfferTerms(checked as boolean)}
                disabled={loading}
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="offer-terms" className="text-sm text-foreground/80">
                Я принимаю <a href="#" className="text-primary hover:underline">условия оферты</a>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy-policy"
                checked={agreePrivacyPolicy}
                onCheckedChange={(checked) => setAgreePrivacyPolicy(checked as boolean)}
                disabled={loading}
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="privacy-policy" className="text-sm text-foreground/80">
                С <a href="#" className="text-primary hover:underline">политикой конфиденциальности</a> ознакомлен/-а
              </Label>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="glow-card border-destructive/30 bg-destructive/5 backdrop-blur-sm"
              >
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-lg">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert
                variant="default"
                className="glow-card border-green-500/30 bg-green-500/5 backdrop-blur-sm text-green-400"
              >
                <CheckCircle className="h-5 w-5" />
                <AlertDescription className="text-lg">{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Регистрация...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
