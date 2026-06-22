# <span style="color: pink;">Repository Guidelines</span>

## <span style="color: pink;">Project Structure & Module Organization</span>

This is a Next.js App Router project backed by a WordPress API. Route files live in `app/`, with grouped static pages under `app/(static)`, dynamic WordPress pages under `app/(dynamic)/[page]`, and the email endpoint at `app/api/send/route.ts`. Shared UI and layout pieces live in `components/`; reusable primitives are in `components/ui/`. Cross-cutting hooks are in `hooks/`, API/types/constants/helpers are in `lib/`, smaller pure utilities are in `utils/`, global styles are in `styles/globals.css`, and static assets are in `public/`.

## <span style="color: pink;">Build, Test, and Development Commands</span>

Use pnpm with Node.js `22.x`.

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: run the local Next.js development server.
- `pnpm build`: create a production build and catch route/type integration issues.
- `pnpm start`: serve the production build locally.
- `pnpm lint`: run Next.js ESLint rules.
- `pnpm format`: format the repository with Prettier.

## <span style="color: pink;">Coding Style & Naming Conventions</span>

Use TypeScript and React function components. Follow Prettier settings: 2-space indentation, double quotes, semicolons, trailing commas, and bracket spacing. ESLint enforces sorted imports/exports, no unused imports, Tailwind class awareness, and sorted JSX props with shorthand and reserved props first. Prefer the `@/` path alias for internal imports. Use kebab-case filenames for components and route helpers, for example `post-gallery.tsx` and `extract-src-from-content.ts`.

## <span style="color: pink;">Testing Guidelines</span>

There is no dedicated test runner configured yet. For every change, run `pnpm lint` and `pnpm build` before handing off. When adding tests, colocate them near the code they cover or place integration tests in a clearly named test directory, and use descriptive names such as `contact-form.test.tsx`. Cover data-fetching, form validation, and route behavior when those areas change.

## <span style="color: pink;">Commit & Pull Request Guidelines</span>

Recent history uses Conventional Commit-style prefixes such as `fix:`, `refactor:`, and `chore:`. Keep commits focused and imperative, for example `fix: adjust mobile image sizing`. Pull requests should include a short summary, verification steps (`pnpm lint`, `pnpm build`), linked issues when applicable, and screenshots or recordings for visible UI changes.

## <span style="color: pink;">Security & Configuration Tips</span>

Copy `.env.local.example` to `.env.local` for local configuration. `WORDPRESS_API_URL` is required for content fetching. Preview variables are optional, and `RESEND_API_KEY` is needed for the contact email flow. Never commit secrets or generated `.env.local` files.
