# Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Variables
Set these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### ✅ Database Setup
Ensure your Supabase database has:
1. `daily_logs` table with proper schema
2. `time_entries` table with proper schema
3. Row Level Security (RLS) enabled
4. Proper RLS policies for authenticated users

### ✅ Build Configuration
- Next.js 16.1.3 configured
- TypeScript strict mode enabled
- TailwindCSS 4 configured
- All dependencies in package.json

### ✅ Code Quality
- No TypeScript errors
- No linting errors
- All imports resolved
- Environment variable validation added

## Deployment Steps

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Apply to Production, Preview, and Development

4. **Deploy**
   - Vercel will automatically detect Next.js
   - Build command: `npm run build` (automatic)
   - Output directory: `.next` (automatic)

5. **Verify**
   - Check build logs for errors
   - Test authentication flow
   - Test data sync
   - Test analytics pages

## Common Issues

### Build Fails
- Check environment variables are set
- Verify all dependencies are in package.json
- Check TypeScript errors

### Runtime Errors
- Verify Supabase credentials are correct
- Check database tables exist
- Verify RLS policies are set up

### Authentication Issues
- Check Supabase auth is enabled
- Verify redirect URLs in Supabase dashboard
- Check middleware is working

## Post-Deployment

1. Test all features:
   - Login/logout
   - Logging entries
   - Analytics pages
   - Settings page

2. Monitor Vercel logs for errors

3. Set up error tracking (optional)

