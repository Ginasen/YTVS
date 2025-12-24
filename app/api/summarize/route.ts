import { type NextRequest, NextResponse } from "next/server"
import axios, { AxiosResponse } from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"

const RAPIDAPI_KEY: string | undefined = process.env.RAPIDAPI_KEY;
const GEMINI_API_KEY: string | undefined = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { url } = await request.json();

    // Validate YouTube URL
    const youtubeRegex: RegExp = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: "Неверный URL YouTube видео" }, { status: 400 });
    }

    // Extract video ID
    const videoId: string | null = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Не удалось извлечь ID видео" }, { status: 400 });
    }

    console.log(`[v0] Получен запрос для видео ID: ${videoId}`);

    let transcriptText: string = "";

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
      );

      console.log("RapidAPI Response Data:", rapidApiResponse.data);
      if (Array.isArray(rapidApiResponse.data) && rapidApiResponse.data.length > 0) {
        transcriptText = rapidApiResponse.data[0].subtitle;
      }
    } catch (rapidApiError: any) {
      console.error("RapidAPI Error:", rapidApiError.message);
      return NextResponse.json(
        { error: "Не удалось получить транскрипт видео из RapidAPI" },
        { status: 500 }
      );
    }

    if (!transcriptText) {
      return NextResponse.json(
        { error: "Не удалось получить транскрипт видео" },
        { status: 400 }
      );
    }

    // Implement Gemini API integration
    const summary: string = await generateSummary(transcriptText);
    console.log("Summary:", summary);
    console.log(`[v0] Краткое изложение успешно создано для видео ${videoId}`);

    return NextResponse.json({ summary: summary });
  } catch (error: any) {
    console.error("[v0] Ошибка при создании краткого изложения:", error);
    
    // Handle specific Gemini API errors
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      return NextResponse.json(
        { error: "Превышен лимит запросов к ИИ. Пожалуйста, попробуйте позже или используйте другой сервис." },
        { status: 429 }
      );
    }
    
    // Handle other Gemini API errors
    if (error.message && error.message.includes("GoogleGenerativeAI Error")) {
      return NextResponse.json(
        { error: "Ошибка сервиса ИИ. Пожалуйста, попробуйте позже." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

async function generateSummary(transcript: string): Promise<string> {
  console.log("Gemini API Key:", GEMINI_API_KEY);
  console.log("Transcript:", transcript);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("Gemini Model:", model);
    const prompt = `Создай структурированное краткое изложение следующей транскрипции видео с YouTube. 

Используй следующий формат в Markdown:

## Основная тема

[Краткое описание основной темы видео]

## Ключевые моменты

- Первый важный момент
- Второй важный момент
- Третий важный момент

## Детали

[Подробное описание с важными деталями]

### Дополнительные подзаголовки

[Если нужно, добавь подразделы]

## Выводы

[Основные выводы и заключение]

Транскрипция:

${transcript}`;
    const result = await model.generateContent(prompt);
    console.log("Gemini Result:", result);
    const response = await result.response;
    console.log("Gemini Response:", response);
    const text = await response.text();
    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

function extractVideoId(url: string): string | null {
  const regex: RegExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match: RegExpMatchArray | null = url.match(regex);
  return match ? match[1] : null;
}
