# Express Port

Courier and delivery services website built with React, TypeScript, Vite, and Supabase.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using your Supabase project's public API settings.
4. Start the development server with `npm run dev`.

Do not commit `.env.local` or put Supabase service-role keys in any `VITE_*` variable. Vite exposes those values to the browser.

## Checks and production build

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Netlify uses the repository's `netlify.toml` redirects for client-side routes. Set the two `VITE_SUPABASE_*` environment variables in the Netlify site settings before building. The `supabase/migrations` files document database changes; apply pending migrations to the Supabase project separately.
