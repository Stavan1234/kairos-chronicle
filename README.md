# Quiet Chronicle

A calm, notebook-like personal productivity and reflection app. Log what happened. Nothing more.

## Features

- **Daily Time Logging**: Log activities in 30-minute slots throughout the day
- **Important-Urgent Matrix**: Visualize where your time goes using Ankur Warikoo's matrix
- **Today Reflection**: See your day's patterns, energy flow, and insights
- **Weekly Patterns**: Understand your weekly rhythms and repeating tasks
- **Calm Interface**: Minimal, text-first design that feels like a notebook

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd quiet-chronicle
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database:

Create the following tables:

**daily_logs**
```sql
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

**time_entries**
```sql
CREATE TABLE time_entries (
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL,
  tasks JSONB DEFAULT '[]',
  important BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  place TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (daily_log_id, time_slot)
);
```

Enable Row Level Security (RLS) and create policies:

```sql
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own entries"
  ON time_entries FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM daily_logs WHERE id = daily_log_id));

CREATE POLICY "Users can insert own entries"
  ON time_entries FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM daily_logs WHERE id = daily_log_id));

CREATE POLICY "Users can update own entries"
  ON time_entries FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM daily_logs WHERE id = daily_log_id));
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your project in [Vercel](https://vercel.com)

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

### Environment Variables

Make sure to set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Daily log (home)
│   ├── analytics/         # Analytics pages
│   ├── auth/              # Auth callback
│   └── login/             # Login page
├── components/            # React components
│   ├── layout/           # Layout components (BottomNav)
│   ├── log/              # Logging components
│   ├── analytics/        # Analytics components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
│   ├── supabase/         # Supabase client setup
│   ├── matrix.ts         # Matrix calculations
│   └── energy.ts         # Energy calculations
└── types.ts              # TypeScript types
```

## License

Private project
