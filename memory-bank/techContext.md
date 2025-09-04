# Technical Context: YouTube Summarizer

## Technologies Used
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database/Auth**: Supabase
- **AI**: (To be determined, likely an external API like OpenAI or a similar LLM service)
- **Package Manager**: pnpm (based on `pnpm-lock.yaml`)

## Development Setup
- Node.js and pnpm installed.
- Environment variables configured in `.env.local` for Supabase and AI API keys.
- Next.js development server for local testing.

## Technical Constraints
- Reliance on external AI service for summarization, subject to API limits and costs.
- Supabase rate limits and pricing tiers.
- YouTube API (if used for transcript fetching) limitations.

## Dependencies
- `next`, `react`, `react-dom`
- `@supabase/supabase-js`
- `tailwindcss`, `postcss`, `autoprefixer`
- `class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`, `tailwindcss-animate` (for Shadcn UI)
- `typescript`, `@types/node`, `@types/react`, `@types/react-dom`

## Tool Usage Patterns
- `pnpm install` for dependency management.
- `pnpm dev` for running the development server.
- Git for version control.
