import { type NextRequest, NextResponse } from "next/server"
import axios, { AxiosResponse } from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from '@supabase/supabase-js'

const RAPIDAPI_KEY: string | undefined = process.env.RAPIDAPI_KEY;
const GEMINI_API_KEY: string | undefined = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { url } = await request.json();

    // Initialize Supabase client
    const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing Supabase URL or Anon Key environment variables.");
      return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Check user session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

async function generateSummary(transcript: string): Promise<string> {
  console.log("Gemini API Key:", GEMINI_API_KEY);
  console.log("Transcript:", transcript);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Gemini Model:", model);
    const prompt = `Предоставь краткое изложение следующей транскрипции видео с YouTube:\n\n${transcript}`;
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
