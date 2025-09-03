"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react" // Import useEffect
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Youtube, Sparkles, CheckCircle, AlertCircle, Zap, Stars, UserPlus, LogIn, LogOut } from "lucide-react" // Add LogIn and LogOut icons

type LoadingState = "idle" | "extracting" | "summarizing" | "complete" | "error"

export default function YouTubeSummarizer() {
  const [url, setUrl] = useState("")
  const [summary, setSummary] = useState<React.ReactNode>(null) // Change type to React.ReactNode
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState("")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [generationCount, setGenerationCount] = useState(0)

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    const storedGenerationCount = localStorage.getItem("generationCount")

    if (storedEmail) {
      setUserEmail(storedEmail)
      setGenerationCount(Number(storedGenerationCount) || 0)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("generationCount")
    setUserEmail(null)
    setGenerationCount(0)
    setSummary("") // Clear summary on logout
    setError("") // Clear any errors
  }

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError("Пожалуйста, введите URL YouTube видео")
      return
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Пожалуйста, введите корректный URL YouTube видео")
      return
    }

    setError("")
    setSummary("")
    setLoadingState("extracting")

    const isUnlimitedUser = userEmail === "i@ginasen.ru"
    const hasReachedLimit = userEmail && generationCount >= 5 && !isUnlimitedUser

    if (hasReachedLimit) {
      setError("Вы достигли лимита в 5 генераций. Пожалуйста, войдите в систему или зарегистрируйтесь для получения большего количества генераций.")
      setLoadingState("idle")
      return
    }

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Произошла ошибка при обработке видео. Попробуйте позже.")
        setLoadingState("error")
        return
      }

      const data = await response.json()
      setSummary(formatSummary(data.summary)) // Format the summary
      setLoadingState("complete")

      if (userEmail && !isUnlimitedUser) {
        const newGenerationCount = generationCount + 1
        setGenerationCount(newGenerationCount)
        localStorage.setItem("generationCount", String(newGenerationCount))
      }
    } catch (err: any) {
      setError("Произошла ошибка при обработке видео. Попробуйте позже.")
      setLoadingState("error")
    }
  }

  const formatSummary = (text: string) => {
    // Split by double newlines to create paragraphs
    return text.split(/\n\s*\n/).map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ))
  }

  const getLoadingMessage = () => {
    switch (loadingState) {
      case "extracting":
        return "Извлечение транскрипта..."
      case "summarizing":
        return "Генерация краткого изложения..."
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen psychedelic-bg floating-orbs relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="morph-shape-1" />
        <div className="morph-shape-2" />
        <div
          className="absolute top-1/4 left-1/3 w-24 h-24 border border-primary/10 rounded-full floating-element"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-16 h-16 border border-secondary/10 rotate-45 floating-element"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-12 h-12 bg-accent/5 rounded-full floating-element"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="text-center mb-12 floating-element">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Youtube className="h-12 w-12 text-primary drop-shadow-md" />
              <div className="absolute inset-0 h-12 w-12 text-primary/30 animate-pulse" />
            </div>
            <Zap className="h-8 w-8 text-accent animate-bounce" />
            <Stars className="h-10 w-10 text-secondary animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold neon-text mb-4 text-balance bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            YouTube Video Summarizer
          </h1>
          <p className="text-xl text-foreground/80 text-pretty font-medium mb-6">
            🚀 Получите краткое изложение любого YouTube видео с помощью ИИ ✨
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {userEmail ? (
              <Button
                onClick={handleLogout}
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Выйти ({userEmail})
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                    <LogIn className="h-5 w-5 mr-2" />
                    Войти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Зарегистрироваться
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <Card className="mb-8 glow-card electric-border bg-card/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl neon-text bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              <Youtube className="h-6 w-6 text-primary" />
              Введите URL видео
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            </CardTitle>
            <CardDescription className="text-lg text-foreground/70">
              Вставьте ссылку на YouTube видео для создания краткого изложения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 text-lg py-6 bg-input/40 backdrop-blur-sm border border-primary/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                  disabled={loadingState === "extracting" || loadingState === "summarizing"}
                />
                <Button
                  type="submit"
                  disabled={
                    loadingState === "extracting" ||
                    loadingState === "summarizing" ||
                    (!!userEmail && generationCount >= 5 && userEmail !== "i@ginasen.ru") // Ensure boolean
                  }
                  className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {loadingState === "extracting" || loadingState === "summarizing" ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Обработка
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                      Сгенерировать
                    </>
                  )}
                </Button>
              </div>

              {userEmail && userEmail !== "i@ginasen.ru" && (
                <Alert variant="default" className="glow-card border-blue-500/30 bg-blue-500/5 backdrop-blur-sm text-blue-400">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="text-lg">
                    Вы использовали {generationCount} из 5 генераций.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert
                  variant="destructive"
                  className="glow-card border-destructive/30 bg-destructive/5 backdrop-blur-sm"
                >
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        {(loadingState === "extracting" || loadingState === "summarizing") && (
          <Card className="mb-8 glow-card bg-card/70 backdrop-blur-md floating-element">
            <CardContent className="pt-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary drop-shadow-md" />
                <span className="text-xl text-foreground font-medium neon-text">{getLoadingMessage()}</span>
                <Zap className="h-6 w-6 text-accent animate-bounce" />
              </div>
              <div className="relative w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-primary via-secondary to-accent"
                  style={{
                    width: loadingState === "extracting" ? "40%" : "85%",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              </div>
            </CardContent>
          </Card>
        )}

        {loadingState === "complete" && summary && (
          <Card className="glow-card bg-card/70 backdrop-blur-md electric-border floating-element">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl neon-text bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                <CheckCircle className="h-7 w-7 animate-pulse" />
                Краткое изложение готово!
                <Stars className="h-6 w-6 text-accent animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed text-lg font-medium">
                {summary}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
