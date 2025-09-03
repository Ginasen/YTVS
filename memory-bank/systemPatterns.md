# System Patterns: YouTube Summarizer

## System Architecture
- **Frontend**: Next.js (React) for user interface.
- **Backend**: Next.js API routes for server-side logic (e.g., summarization, Supabase integration).
- **Database/Auth**: Supabase for user authentication and data storage.
- **AI/Summarization**: External AI service (e.g., OpenAI, custom model) integrated via API.

## Key Technical Decisions
- Using Next.js for a full-stack approach (frontend and backend API routes).
- Supabase for managed authentication and database, reducing boilerplate.
- Modular component design for reusability and maintainability.

## Design Patterns in Use
- **Component-based architecture**: React components for UI.
- **API Routes**: For handling server-side logic and external API calls.
- **Client-Server interaction**: Fetching data from API routes, submitting forms.

## Component Relationships
- `app/page.tsx`: Main landing page, likely contains the summarization input.
- `app/login/page.tsx`, `app/register/page.tsx`: Authentication pages.
- `app/api/summarize/route.ts`: API endpoint for video summarization.
- `app/api/delete-user/route.ts`: API endpoint for user deletion.
- `lib/supabase.ts`: Supabase client initialization and utility functions.
- `components/ui/*`: Shadcn UI components for consistent styling and functionality.

## Critical Implementation Paths
- User authentication flow (registration, login, session management).
- YouTube URL submission and summarization process.
- Secure handling of API keys and sensitive information (e.g., `.env.local`).
