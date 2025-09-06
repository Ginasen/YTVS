# System Patterns: YouTube Summarizer

## Environment Variables Configuration

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL** - Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Supabase anonymous API key (client-side)
3. **SUPABASE_SERVICE_ROLE_KEY** - Supabase service role key (server-side, admin operations)
4. **RAPIDAPI_KEY** - API key for YouTube transcript service
5. **GEMINI_API_KEY** - Google Gemini API key for AI summarization
6. **GOOGLE_CLOUD_PROJECT** - Google Cloud project ID

### Environment Variable Management

- All environment variables are stored in `.env.local`
- Variables prefixed with `NEXT_PUBLIC_` are available client-side
- Server-side variables should NOT be prefixed with `NEXT_PUBLIC_`
- Never commit `.env.local` to version control

## API Integration Patterns

### YouTube Transcript Retrieval
- Uses RapidAPI service to fetch YouTube video transcripts
- API endpoint: `youtube-captions-transcript-subtitles-video-combiner.p.rapidapi.com`

### AI Summarization
- Primary: Google Gemini API (`@google/generative-ai`)
- Model: `gemini-1.5-flash` for fast summarization

### Supabase Integration
- Client-side: Uses anonymous key for user authentication
- Server-side: Uses service role key for admin operations
- Singleton pattern for Supabase client initialization

## Security Considerations

1. **API Key Protection**
   - Never expose server-side keys to client-side code
   - Use environment variables for all sensitive keys
   - Rotate keys regularly

2. **Error Handling**
   - Never expose raw API keys in error messages
   - Mask sensitive data in logs
   - Handle API rate limiting gracefully

3. **Authentication**
   - Use Supabase built-in authentication
   - Validate user sessions server-side
   - Implement proper logout functionality

## Testing Patterns

### Environment Variable Testing
- `/api/test-env` endpoint verifies all environment variables
- Logs masked versions of keys for verification
- Returns status of each required variable

### API Integration Testing
- Test YouTube transcript retrieval
- Test AI summarization with sample text
- Test Supabase client connectivity
- Test user authentication flows

## Future Enhancements

### Enhanced Error Handling
- More detailed error categorization
- User-friendly error messages
