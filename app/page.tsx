"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Youtube, Sparkles, CheckCircle, AlertCircle, Zap, Stars } from "lucide-react"

type LoadingState = "idle" | "extracting" | "summarizing" | "complete" | "error"

export default function YouTubeSummarizer() {
  const [url, setUrl] = useState("")
  const [summary, setSummary] = useState("")
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState("")

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
      setSummary(data.summary)
      setLoadingState("complete")
    } catch (err: any) {
      setError("Произошла ошибка при обработке видео. Попробуйте позже.")
      setLoadingState("error")
    }
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
          <h1 className="text-6xl font-bold neon-text mb-4 text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            YouTube Video Summarizer
          </h1>
          <p className="text-xl text-foreground/80 text-pretty font-medium">
            🚀 Получите краткое изложение любого YouTube видео с помощью ИИ ✨
          </p>
        </div>

        <Card className="mb-8 glow-card electric-border bg-card/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl neon-text">
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
                  disabled={loadingState === "extracting" || loadingState === "summarizing"}
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
              <CardTitle className="flex items-center gap-3 text-2xl neon-text text-primary">
                <CheckCircle className="h-7 w-7 animate-pulse" />
                Краткое изложение готово!
                <Stars className="h-6 w-6 text-accent animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg font-medium">{summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
