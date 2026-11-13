# Bharat Patel · Build Log

A Next.js portfolio shaped as an engineering field log: each project records its problem, approach, role and current status; recognition is paired with an inspectable source document where available.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Run the production checks with `npm run build` and `npm run lint`.

## Asset handling

The originals remain in `C:\Users\BHARAT\Downloads\Protfolio`. The checked-in files under `public/` are derived copies. Rebuild them with:

```bash
npm run assets:import -- "C:\Users\BHARAT\Downloads\Protfolio"
```

The importer trims scanner/table backgrounds from certificate derivatives, keeps certificate text readable, writes WebP files, copies the Yatri PDF and `Protfolio/Bharat_Patel_Resume_General.pdf` as the public resume, and regenerates `public/asset-inventory.json`. It does not publish ambiguous event photos. The Tech Hunt record is intentionally unpublished because its certificate says Participant while the reported third-place claim is unverified.

## Supabase setup

1. Create a Supabase project and copy its project URL and publishable key into `.env.local` using `.env.example` as the template. Never use a service-role key in the browser or commit environment secrets.
2. Apply `supabase/migrations/202611030001_portfolio.sql` using the Supabase SQL editor or CLI.
3. Keep public sign-up disabled in Supabase Auth. Create the owner account using the Supabase dashboard, then add its Auth user ID from a trusted SQL editor:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

4. Restart the Next.js server. `/admin` verifies the Supabase token on the server and checks `admin_users`; missing configuration redirects to a setup-needed page.

The SQL migration includes the content schema, RLS policies and storage write restrictions. The current public page still renders its confirmed content from `src/lib/portfolio-data.ts`; database-backed public reads and full CRUD screens are not wired yet. Do not treat the dashboard shell as a complete CMS until those connections and CRUD flows have been implemented and tested against a configured Supabase project.

## Deployment

Deploy the Next.js app to Vercel, configure the Supabase environment variables in the deployment environment, apply the migration, and add the owner user to the allowlist. Add the final public URL as `NEXT_PUBLIC_SITE_URL` before publishing sitemap/robots metadata.

No production authentication, uploads or database operations have been verified in this workspace because Supabase credentials were not provided.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
