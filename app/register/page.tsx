"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeOfferTerms, setAgreeOfferTerms] = useState(false)
  const [agreePrivacyPolicy, setAgreePrivacyPolicy] = useState(false)
  const [agreePersonalDataPolicy, setAgreePersonalDataPolicy] = useState(false) // New state for personal data policy
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

    if (!name.trim() || !email.trim() || !password.trim()) {
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

    if (!agreePersonalDataPolicy) { // New validation for personal data policy
      setError("Вы должны согласиться с политикой персональных данных.")
      return
    }

    setLoading(true)

    console.log("[REGISTER] About to call getSupabaseClient...")
    console.log("[REGISTER] typeof getSupabaseClient:", typeof getSupabaseClient)
    
    if (typeof getSupabaseClient !== 'function') {
      console.error("[REGISTER] getSupabaseClient is not a function!", getSupabaseClient)
      setLoading(false)
      setError("Ошибка инициализации клиента Supabase: функция не найдена.")
      return
    }
    
    let supabase;
    try {
      supabase = getSupabaseClient()
      console.log("[REGISTER] getSupabaseClient returned:", supabase)
      if (!supabase) {
        setLoading(false)
        setError("Ошибка инициализации клиента Supabase.")
        return
      }
      
      // Test the client by trying a simple operation
      console.log("[REGISTER] Testing Supabase client connectivity...")
    } catch (clientError: any) {
      console.error("[REGISTER] Error calling createSupabaseClient:", clientError)
      setLoading(false)
      setError("Ошибка инициализации клиента Supabase: " + (clientError.message || 'Неизвестная ошибка'))
      return
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    if (authData.user) {
      try {
        // First, let's check if the profiles table exists and what columns it has
        console.log("[REGISTER] Checking profiles table structure...");
        
        // Insert into profiles table after successful auth.users creation
        console.log("[REGISTER] About to insert profile for user:", {
          userId: authData.user.id,
          fullName: name
        });
        
        const { error: profileError, data: profileData } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user.id,
              full_name: name,
            },
          ])
          .select();

        console.log("[REGISTER] Profile insert result:", { profileError, profileData });

        if (profileError) {
          console.error("[REGISTER] Profile creation error:", profileError);
          console.error("[REGISTER] Error details:", {
            code: profileError.code,
            hint: profileError.hint,
            details: profileError.details
          });
          
          // Try to get more information about the profiles table
          try {
            const { data: tableInfo, error: tableError } = await supabase
              .from("profiles")
              .select("*")
              .limit(1);
            
            console.log("[REGISTER] Profiles table info:", { tableInfo, tableError });
          } catch (tableCheckError) {
            console.error("[REGISTER] Error checking profiles table:", tableCheckError);
          }
          
          setLoading(false);
          let errorMessage = `Ошибка базы данных при сохранении профиля: ${profileError.message}`;
          
          // Provide more specific error messages based on common issues
          if (profileError.code === '42P01') {
            errorMessage = "Ошибка: Таблица 'profiles' не существует в базе данных. Пожалуйста, создайте таблицу 'profiles' в Supabase.";
          } else if (profileError.code === '23503') {
            errorMessage = "Ошибка: Нарушение внешнего ключа. Пользователь не найден в таблице auth.users.";
          } else if (profileError.code === '23505') {
            errorMessage = "Ошибка: Профиль для этого пользователя уже существует.";
          } else if (profileError.message.includes('column') && profileError.message.includes('does not exist')) {
            errorMessage = "Ошибка: Одна из колонок в таблице 'profiles' не существует или имеет другое имя.";
          }
          
          setError(errorMessage);
          // Optionally, you might want to delete the user from auth.users if profile creation fails
          // await supabase.auth.admin.deleteUser(authData.user.id);
          return;
        }

        setLoading(false);
        setSuccess("Регистрация прошла успешно! Проверьте свою почту для подтверждения.");
        setName("");
        setEmail("");
        setPassword("");
        setAgreeOfferTerms(false);
        setAgreePrivacyPolicy(false);
        setAgreePersonalDataPolicy(false); // Reset new checkbox state
        router.push("/login"); // Redirect to login page after successful registration
      } catch (dbError: any) {
        console.error("[REGISTER] Database error:", dbError);
        setLoading(false);
        setError(`Ошибка базы данных: ${dbError.message || 'Неизвестная ошибка базы данных'}`);
        return;
      }
    } else {
      setLoading(false)
      setError("Не удалось зарегистрировать пользователя.")
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
                  placeholder="•••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* New checkbox for personal data policy */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="personal-data-policy"
                checked={agreePersonalDataPolicy}
                onCheckedChange={(checked) => setAgreePersonalDataPolicy(checked as boolean)}
                disabled={loading}
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="personal-data-policy" className="text-sm text-foreground/80">
                С <a href="#" className="text-primary hover:underline">политикой персональных данных</a> согласен/-а
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
