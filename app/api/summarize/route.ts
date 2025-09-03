import { type NextRequest, NextResponse } from "next/server"
import axios, { AxiosResponse } from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@supabase/supabase-js"

const RAPIDAPI_KEY: string | undefined = process.env.RAPIDAPI_KEY
const GEMINI_API_KEY: string | undefined = process.env.GEMINI_API_KEY
const SUPABASE_URL: string | undefined = process.env.PROJECT_URL
const SUPABASE_ANON_KEY: string | undefined = process.env.SUPABASE_ANON_KEY

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase URL or Anon Key environment variables.")
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Неавторизованный доступ" }, { status: 401 })
    }

    const { url } = await request.json()

    // Validate YouTube URL
    const youtubeRegex: RegExp = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: "Неверный URL YouTube видео" }, { status: 400 })
    }

    // Extract video ID
    const videoId: string | null = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: "Не удалось извлечь ID видео" }, { status: 400 })
    }

    console.log(`[v0] Получен запрос для видео ID: ${videoId}`)

    let transcriptText: string = ""

    try {
      // Fetch transcript from RapidAPI
      const rapidApiResponse: AxiosResponse<any> = await axios.get(
        `https://youtube-captions-transcript-subtitles-video-combiner.p.rapidapi.com/download-all/${videoId}?format_subtitle=srt&format_answer=json`,
        {
          headers: {
            "X-RapidAPI-Host": "youtube-captions-transcript-subtitles-video-combiner.p.rapidapi.com",
            "X-RapidAPI-Key": RAPIDAPI_KEY || "",
          },
        }
      )

      console.log("RapidAPI Response Data:", rapidApiResponse.data);
      if (Array.isArray(rapidApiResponse.data) && rapidApiResponse.data.length > 0) {
        transcriptText = rapidApiResponse.data[0].subtitle;
      }
    } catch (rapidApiError: any) {
      console.error("RapidAPI Error:", rapidApiError.message)
      return NextResponse.json(
        { error: "Не удалось получить транскрипт видео из RapidAPI" },
        { status: 500 }
      )
    }

    if (!transcriptText) {
      return NextResponse.json(
        { error: "Не удалось получить транскрипт видео" },
        { status: 400 }
      )
    }

    // Implement Gemini API integration
    const summary: string = await generateSummary(transcriptText)

    console.log(`[v0] Краткое изложение успешно создано для видео ${videoId}`)

    return NextResponse.json({ summary: summary })
  } catch (error: any) {
    console.error("[v0] Ошибка при создании краткого изложения:", error)
    if (error.status === 503) {
      return NextResponse.json(
        { error: "Сервис суммаризации временно недоступен. Пожалуйста, попробуйте позже." },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

async function generateSummary(transcript: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined")
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Предоставь краткое изложение следующей транскрипции видео с YouTube, разбивая его на логические абзацы:\n\n${transcript}`
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  return text
}

function extractVideoId(url: string): string | null {
  const regex: RegExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match: RegExpMatchArray | null = url.match(regex)
  return match ? match[1] : null
}
