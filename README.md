# kmconsulting-homepage

## Local development

This homepage is prepared as a Next.js App Router project for class.

```bash
pnpm install
pnpm dev
```

Main pages:

- `/` homepage
- `/ui-lab` UI practice page

Next.js reads environment variables from `.env`.

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_PASSWORD=
```

For Vercel, add the same variables in Project Settings > Environment Variables.
