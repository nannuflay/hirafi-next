# Hirafi — Collaborator Onboarding Guide

> **Hirafi** (حرفي) means "craftsman" or "professional" in Arabic. The platform connects Moroccan clients with local service providers (vendors) for trades like plumbing, electrical work, appliance repair, and transport/moving.

---

## Table of Contents

1. [What We're Building](#1-what-were-building)
2. [Tech Stack](#2-tech-stack)
3. [User Roles & Auth Flow](#3-user-roles--auth-flow)
4. [Feature Map](#4-feature-map)
5. [Database Schema](#5-database-schema)
6. [Row Level Security (RLS) Rules](#6-row-level-security-rls-rules)
7. [Project Structure](#7-project-structure)
8. [Key Data Flows](#8-key-data-flows)
9. [Environment Setup](#9-environment-setup)
10. [Conventions & Rules](#10-conventions--rules)

---

## 1. What We're Building

Hirafi is a **local services marketplace** targeting Morocco. Think of it as a booking platform where:

- A **client** finds a plumber in Casablanca available next Tuesday and books them directly.
- A **vendor** (Hirafi) publishes their availability slots and receives booking requests through their profile page.

**V1 scope** is intentionally narrow: profile-based listings + direct date bookings. Classified ads/posts are deferred to V2.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) — **read `node_modules/next/dist/docs/` before touching routing or layout** |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix base, Nova preset) |
| Auth | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Server logic | Next.js Server Actions (`"use server"`) |
| Path alias | `@/` → project root |

> **Important:** This project uses **Next.js 16** and **Tailwind v4**, both of which have breaking changes from their previous major versions. Do not assume behaviour from older docs or training data. Always check `node_modules/next/dist/docs/` first.

---

## 3. User Roles & Auth Flow

### Roles

```
auth.users (Supabase managed)
    └── profiles
            ├── role = "client"   → regular user looking for services
            └── role = "vendor"   → service provider (Hirafi)
```

### Signup Flow

```
User visits /signup
    → fills email + password + chooses role (client | vendor)
    → Supabase Auth creates auth.users record
    → Server Action inserts row into profiles (same id as auth.users)
    → redirect to role-appropriate dashboard
        ├── client  → /dashboard/client
        └── vendor  → /dashboard/vendor
```

### Login Flow

```
User visits /login
    → Supabase Auth validates credentials
    → Server Action reads profiles.role
    → redirect to correct dashboard
```

### Session Strategy

- Supabase session is managed via cookies (SSR-safe).
- Use the **server-side Supabase client** in Server Components and Server Actions.
- Use the **browser Supabase client** only in Client Components that require real-time or user-initiated interactions.

---

## 4. Feature Map

### Client-Facing Features

| Feature | Route | Description |
|---|---|---|
| Home / Landing | `/` | Hero + search bar + testimonials + footer |
| Search Results | `/search` | Vendor card grid filtered by city, category, date |
| Vendor Profile | `/vendor/[id]` | Public profile, ratings, available dates, booking CTA |
| Client Dashboard | `/dashboard/client` | Booking history, favorites, settings |

#### Home Page Layout (top → bottom)

```
┌─────────────────────────────────────┐
│  Navbar (logo + auth links)         │
├─────────────────────────────────────┤
│  Hero Section                       │
│  - Tagline                          │
│  - SearchBar (City | Category |     │
│    Date selects + text input)       │
├─────────────────────────────────────┤
│  How It Works (3-step explainer)    │
├─────────────────────────────────────┤
│  Testimonials                       │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

#### Search Results Page

- Reads `?city=`, `?category=`, `?date=`, `?q=` query params (set by the Home SearchBar).
- Fetches matching vendors server-side and renders a grid of `<VendorCard>` components.
- Each card links to `/vendor/[id]`.

#### Vendor Detail Page (`/vendor/[id]`)

- Fetches vendor profile + `vendor_services` + available `availabilities`.
- Client selects an available date from a calendar/list.
- "Book Now" triggers a Server Action that creates a `bookings` row and marks the slot as booked.

### Vendor-Facing Features

| Feature | Route | Description |
|---|---|---|
| Vendor Dashboard | `/dashboard/vendor` | Upcoming bookings, earnings summary, activity feed |
| Profile Edit | `/dashboard/vendor/profile` | Category, bio, city, rate |
| Availability Manager | `/dashboard/vendor/availability` | Add/remove available date slots |

---

## 5. Database Schema

### SQL Migration Script

```sql
-- ─── ENUMS ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('client', 'vendor');

CREATE TYPE service_category AS ENUM (
  'transport',
  'appliance_repair',
  'plumbing',
  'electricity',
  'carpentry',
  'painting',
  'cleaning',
  'other'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

-- ─── TABLES ──────────────────────────────────────────────────────────────────

-- 1. profiles (extends auth.users 1-to-1)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  city        TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. vendor_services (one vendor → one service profile in V1)
CREATE TABLE vendor_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category    service_category NOT NULL,
  bio         TEXT,
  rate        NUMERIC(10, 2),           -- hourly or per-job rate in MAD
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vendor_id)                    -- one service profile per vendor in V1
);

-- 3. availabilities
CREATE TABLE availabilities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  available_date  DATE NOT NULL,
  is_booked       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vendor_id, available_date)    -- no duplicate slots
);

-- 4. bookings
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  availability_id UUID REFERENCES availabilities(id) ON DELETE SET NULL,
  booking_date  DATE NOT NULL,
  status        booking_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. favorites
CREATE TABLE favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, vendor_id)         -- no duplicate favorites
);
```

### Entity Relationship (simplified)

```
auth.users
    │ 1
    ▼
profiles ──────────────────────────────────────┐
    │ 1 (vendor)          │ 1 (client)          │ (vendor or client)
    ▼                     ▼                     ▼
vendor_services      favorites            bookings
    │                                          │
availabilities ◄───────────────────────────────┘
  (is_booked flips TRUE when booking is confirmed)
```

---

## 6. Row Level Security (RLS) Rules

Enable RLS on all tables. Below are the conceptual policies — implement them as Supabase RLS policies.

| Table | Operation | Who | Condition |
|---|---|---|---|
| `profiles` | SELECT | Anyone | — (public reads) |
| `profiles` | UPDATE | Owner only | `auth.uid() = id` |
| `vendor_services` | SELECT | Anyone | — (public reads) |
| `vendor_services` | INSERT / UPDATE / DELETE | Vendor only | `auth.uid() = vendor_id` |
| `availabilities` | SELECT | Anyone | — (clients need to see open slots) |
| `availabilities` | INSERT / UPDATE / DELETE | Vendor only | `auth.uid() = vendor_id` |
| `bookings` | SELECT | Parties only | `auth.uid() = client_id OR auth.uid() = vendor_id` |
| `bookings` | INSERT | Client only | `auth.uid() = client_id` |
| `bookings` | UPDATE | Vendor only | `auth.uid() = vendor_id` (e.g. confirm/cancel) |
| `favorites` | SELECT / INSERT / DELETE | Owner only | `auth.uid() = client_id` |

---

## 7. Project Structure

```
hirafi-next/
├── app/
│   ├── layout.tsx                     # Root layout (fonts, globals.css)
│   ├── page.tsx                       # Home / Landing page
│   │
│   ├── (auth)/                        # Auth route group (no shared layout)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── search/
│   │   └── page.tsx                   # Search results (reads searchParams)
│   │
│   ├── vendor/
│   │   └── [id]/page.tsx              # Public vendor profile + booking UI
│   │
│   └── dashboard/
│       ├── client/
│       │   ├── page.tsx               # Client dashboard home
│       │   ├── favorites/page.tsx
│       │   └── history/page.tsx
│       └── vendor/
│           ├── page.tsx               # Vendor dashboard home
│           ├── profile/page.tsx
│           └── availability/page.tsx
│
├── components/
│   ├── ui/                            # shadcn/ui auto-generated components
│   │   └── button.tsx
│   ├── search/
│   │   ├── SearchBar.tsx              # Home hero search bar (Client Component)
│   │   └── VendorCard.tsx             # Card shown in search results
│   ├── vendor/
│   │   ├── BookingCalendar.tsx        # Date picker for vendor profile page
│   │   └── AvailabilityManager.tsx    # Vendor dashboard slot manager
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── dashboard/
│       ├── BookingTable.tsx
│       └── EarningsSummary.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                  # Server-side Supabase client (cookies)
│   │   └── client.ts                  # Browser Supabase client
│   └── utils.ts                       # cn() and shared helpers
│
├── actions/                           # Next.js Server Actions ("use server")
│   ├── auth.ts                        # signUp, signIn, signOut
│   ├── vendors.ts                     # searchVendors, getVendorById
│   ├── bookings.ts                    # createBooking, updateBookingStatus
│   ├── availability.ts                # addSlot, removeSlot
│   └── favorites.ts                   # addFavorite, removeFavorite
│
├── types/
│   └── index.ts                       # Shared TypeScript types (Profile, Booking, etc.)
│
├── docs/
│   └── ONBOARDING.md                  # This file
│
├── components.json                    # shadcn/ui config
├── next.config.ts
├── tsconfig.json
└── .env.local                         # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 8. Key Data Flows

### Flow A — Client searches for a vendor

```
1. User fills SearchBar on Home page
        city="Casablanca", category="plumbing", date="2024-12-10"
2. SearchBar pushes to /search?city=Casablanca&category=plumbing&date=2024-12-10
3. /search/page.tsx (Server Component) reads searchParams
4. calls searchVendors() Server Action
        → SELECT profiles JOIN vendor_services JOIN availabilities
          WHERE city = $city AND category = $category AND available_date = $date AND is_booked = false
5. Renders <VendorCard> grid with results
```

### Flow B — Client books a vendor

```
1. Client is on /vendor/[id]
2. Selects an available date from <BookingCalendar>
3. Clicks "Book Now" → triggers createBooking() Server Action
4. Server Action (in a transaction):
        a. INSERT into bookings (status = 'pending')
        b. UPDATE availabilities SET is_booked = true WHERE id = $availability_id
5. Client is redirected to /dashboard/client/history
6. Vendor sees new booking on their dashboard (status = 'pending')
7. Vendor confirms → updateBookingStatus('confirmed')
```

### Flow C — Vendor manages availability

```
1. Vendor on /dashboard/vendor/availability
2. Picks a date on <AvailabilityManager>
3. Clicks "Add Slot" → addSlot() Server Action
        → INSERT into availabilities (vendor_id, available_date)
4. Slot appears immediately (revalidatePath invalidates cache)
5. Vendor can delete a slot (if not is_booked) → removeSlot()
```

### Flow D — Signup & role assignment

```
1. User fills /signup form (email, password, full_name, role)
2. signUp() Server Action:
        a. supabase.auth.signUp({ email, password })
        b. INSERT into profiles (id = user.id, role, full_name)
3. Redirect based on role:
        'vendor' → /dashboard/vendor
        'client' → /dashboard/client
```

---

## 9. Environment Setup

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works)

### Steps

```bash
# 1. Clone and install
git clone <repo-url>
cd hirafi-next
npm install

# 2. Create environment file
cp .env.local.example .env.local
# Fill in:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 3. Run the SQL migration script in Supabase SQL Editor
#    (copy from docs/ONBOARDING.md §5 or a dedicated migration file)

# 4. Enable RLS on each table in Supabase dashboard
#    and add policies described in §6

# 5. Start dev server
npm run dev
```

---

## 10. Conventions & Rules

| Topic | Rule |
|---|---|
| **Data fetching** | Always fetch data in Server Components or Server Actions. Never fetch from Client Components directly (no `useEffect` + `supabase.from(...)` for initial loads). |
| **Mutations** | All writes go through Server Actions in `/actions/`. Never call Supabase from the browser for mutations. |
| **Auth checks** | Protect dashboard routes via middleware or layout-level session checks. Redirect unauthenticated users to `/login`. |
| **Role guard** | After session check, verify `profiles.role` matches the expected role for the route (client routes reject vendors, and vice versa). |
| **Imports** | Use `@/` alias for all internal imports (e.g. `@/lib/supabase/server`). |
| **Comments** | Only add a comment when the *why* is non-obvious. No JSDoc blocks on straightforward components. |
| **Styling** | Tailwind v4 utility classes only. Do not write custom CSS unless unavoidable. Use `cn()` from `@/lib/utils` for conditional classes. |
| **Next.js docs** | Before touching routing, layouts, or caching: read `node_modules/next/dist/docs/`. This is Next.js 16 — behaviour differs from v14/v15. |
