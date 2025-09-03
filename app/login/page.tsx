"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email.trim() || !password.trim()) {
      setError("Пожалуйста, введите email и пароль.")
      return
    }

    setLoading(true)
    // Simulate API call for login
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)

    // In a real application, you would verify credentials with your backend
    // For demonstration, let's assume a successful login for any input
    // and store a dummy user session in local storage.
    localStorage.setItem("userEmail", email)
    localStorage.setItem("generationCount", "0") // Reset generation count on login

    setSuccess("Вход выполнен успешно! Добро пожаловать.")
    setEmail("")
    setPassword("")
    // Redirect to main page or dashboard after successful login
    router.push("/");
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
            Вход
          </CardTitle>
          <CardDescription className="text-lg text-foreground/70">
            Войдите в свой аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
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
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Войти
                </>
              )}
            </Button>
            <div className="text-center text-sm text-foreground/70 mt-4">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-primary hover:underline flex items-center justify-center gap-1">
                <UserPlus className="h-4 w-4" /> Зарегистрироваться
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
