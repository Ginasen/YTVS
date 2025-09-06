"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Mail, Trash2, AlertCircle, CheckCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (!email) {
      router.push("/login")
    } else {
      setUserEmail(email)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("generationCount")
    router.push("/login")
  }

  const handleDeleteAccount = async () => {
    setError("")
    setSuccess("")

    if (deleteConfirmation !== "УДАЛИТЬ") {
      setError("Пожалуйста, введите 'УДАЛИТЬ' для подтверждения удаления аккаунта.")
      return
    }

    setDeleting(true)

    try {
      // In a real application, you would get the actual user ID from your auth system
      // For this demo, we'll simulate the deletion
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "demo-user-id" // This would be the actual user ID in a real app
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account")
      }

      const data = await response.json()
      setSuccess(data.message)

      // Clear local storage and redirect to login
      localStorage.removeItem("userEmail")
      localStorage.removeItem("generationCount")
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "Произошла ошибка при удалении аккаунта")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen psychedelic-bg floating-orbs relative overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="morph-shape-1" />
        <div className="morph-shape-2" />
      </div>

      <div className="container mx-auto max-w-2xl relative z-10 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-text mb-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Профиль
          </h1>
          <p className="text-xl text-foreground/80">
            Управление вашим аккаунтом
          </p>
        </div>

        <Card className="glow-card electric-border bg-card/70 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl neon-text bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              <User className="h-6 w-6" />
              Информация о пользователе
            </CardTitle>
            <CardDescription className="text-lg text-foreground/70">
              Ваши данные и настройки аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg">Email</Label>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={userEmail || ""}
                  readOnly
                  className="text-lg py-6 bg-input/40 backdrop-blur-sm border border-primary/20"
                />
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full px-6 py-6 text-lg font-bold border border-primary/20 hover:bg-primary/10 transition-all duration-300"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Выйти из аккаунта
            </Button>
          </CardContent>
        </Card>

        <Card className="glow-card electric-border bg-card/70 backdrop-blur-md border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-destructive">
              <Trash2 className="h-6 w-6" />
              Опасная зона
            </CardTitle>
            <CardDescription className="text-lg text-foreground/70">
              Удаление аккаунта необратимо
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive" className="glow-card border-destructive/30 bg-destructive/5 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-lg">
                <strong>Внимание:</strong> Удаление вашего аккаунта приведет к безвозвратному удалению всех ваших данных, включая историю генераций и настройки. Это действие нельзя отменить.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label className="text-lg text-destructive">
                Для подтверждения введите "УДАЛИТЬ"
              </Label>
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Введите УДАЛИТЬ"
                className="text-lg py-6 bg-input/40 backdrop-blur-sm border border-destructive/30 focus:border-destructive/50 focus:ring-1 focus:ring-destructive/20 transition-all duration-300"
                disabled={deleting}
              />
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
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirmation !== "УДАЛИТЬ"}
              className="w-full px-6 py-6 text-lg font-bold bg-gradient-to-r from-destructive to-red-700 hover:from-red-700 hover:to-destructive transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  Удалить аккаунт
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
