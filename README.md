# kmconsulting-homepage

## Local development

This homepage can still be opened as a static `index.html`, but it also supports
the Vite/Vercel workflow used in class.

```bash
npm install
npm run dev
```

Vite reads environment variables from `.env`.

Required variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_GOOGLE_APPS_SCRIPT_URL=
VITE_GOOGLE_APPS_SCRIPT_PASSWORD=
```

For Vercel, add the same variables in Project Settings > Environment Variables.
