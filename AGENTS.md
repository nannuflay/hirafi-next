<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hirafi Project Guidelines

## Tech Stack
- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Supabase** (auth + database + storage) with `@supabase/ssr`
- **shadcn/ui** (base-luma style, stone palette) + **Tailwind CSS v4**
- **i18n** via `[lang]` dynamic segment (en/fr/ar, RTL support for Arabic)
- **Server Actions** with React 19 `useActionState` pattern

## Folder Structure

```
app/
  [lang]/                      # All routes are locale-scoped
    layout.tsx                 # Root layout (html lang, dir, font)
    page.tsx                   # Homepage
    dictionaries.ts            # i18n loader (server-only)
    (auth)/                    # Route group — no URL segment added
      layout.tsx               # Shared auth layout
      login/page.tsx
      signup/page.tsx
    dashboard/
      layout.tsx               # Auth-gated, renders sidebar + main
      page.tsx                 # Role-based redirect
      client/                  # Client-specific pages
      vendor/                  # Vendor-specific pages

components/
  ui/                          # shadcn/ui primitives (DO NOT manually edit)
  auth/                        # Auth feature components
  dashboard/                   # Dashboard feature components
    sidebar/                   # Self-contained sub-module with index.tsx
  home/                        # Homepage section components
  icons/                       # Custom SVG icons

actions/                       # Server actions (top-level, flat)
lib/
  utils.ts                     # cn() helper
  supabase/                    # server.ts, client.ts, admin.ts
types/
  database.ts                  # Supabase types + domain types
```

## Component Conventions

### Server vs Client Components
- **Pages are Server Components** by default. Fetch data (Supabase, auth) directly in page/layout files.
- **Client Components** (`"use client"`) are for interactive UI only: forms, sidebar, navbar, dropdowns, modals.
- **Pattern**: Server page fetches data → passes as props to client component. Dictionary is loaded server-side and passed as `dict` prop.
- Never put `"use client"` on a page file unless absolutely necessary.

### Naming & Exports
- **PascalCase** filenames for feature components (`SignupFlow.tsx`, `LoginForm.tsx`)
- **kebab-case** filenames for sub-component modules (`sidebar-body.tsx`, `nav-item.tsx`)
- **Named exports only** — no default exports except for `app/` page and layout files.
- Component function names must match their file name.

### Feature Module Pattern
For complex components (like the sidebar), create a sub-directory:
```
components/dashboard/sidebar/
  index.tsx          # Main exported component (barrel)
  sidebar-body.tsx   # Internal orchestrator
  brand.tsx          # Sub-chunk
  nav-item.tsx       # Sub-chunk
  user-menu.tsx      # Sub-chunk
```
- Only `index.tsx` is imported by outside consumers.
- Internal sub-components are NOT exported from the barrel.

### shadcn/ui Components
- Live in `components/ui/`. Install via `npx shadcn@latest add <component>`.
- **DO NOT** manually create or edit shadcn primitives. Always use the CLI.
- Import from `@/components/ui/<component>` directly (no barrel re-exports).

## i18n Pattern
- All routes are under `[lang]/` segment. Supported locales: `en`, `fr`, `ar`.
- Dictionaries live in `dictionaries/` directory as JSON files.
- Server components load dict via `getDictionary(lang)` and pass to client components.
- Client components receive `dict: Dictionary` prop, destructure the relevant section (e.g., `dict.dashboard.sidebar`).
- Translation keys are accessed via `t[keyName]`.
- RTL: `dir="rtl"` is set on `<html>` when `lang === 'ar'`.

## Server Actions
- All in `actions/` directory with `'use server'` directive.
- Follow React 19 `useActionState` signature: `(prevState, formData) => { ... }`.
- Return `{ error?, success?, ... }` objects. Never throw on expected errors.
- Client components consume via `useActionState(action, initialState)`.

## Supabase Patterns
- **Server-side**: `createClient()` from `@/lib/supabase/server` (cookie-based)
- **Client-side**: `createClient()` from `@/lib/supabase/client` (browser)
- **Admin**: `createAdminClient()` from `@/lib/supabase/admin` (service role, bypasses RLS)
- Always import the correct client for the context. Server components MUST use the server client.

## Styling
- Use `cn()` from `@/lib/utils` for conditional classes (clsx + tailwind-merge).
- Prefer Tailwind utility classes. Avoid inline styles.
- Use `class-variance-authority` (CVA) for component variants when needed.
- Transition classes: use `transition-all duration-200` as default for smooth interactions.

## Path Aliases
- `@/*` maps to project root. Always use `@/` prefixed imports:
  - `@/components/...`, `@/lib/...`, `@/actions/...`, `@/types/...`
- Never use relative paths for cross-directory imports (`../../`).

## Code Style
- Single quotes for strings.
- No semicolons (unless required by syntax).
- Trailing commas in multi-line arrays/objects.
- Keep files focused: one component per file for feature components.
- Extract reusable sub-chunks when a component exceeds ~100 lines or has distinct visual sections.
