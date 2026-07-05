# Hisaab — Production Build Plan

A mobile-first, production-ready SaaS webapp for tractor owners to digitize income
(field-plowing service payments) and expense tracking, replacing a paper ledger.
Multi-tenant, bilingual (English / Assamese), light & dark mode.

---

## 1. Product Summary

**Who it's for:** Tractor owners in rural Assam who plow farmers' fields for payment
during the agricultural season. Currently tracked on paper in a notebook (Income /
Expense ledger with dates, descriptions, and amounts).

**Core problem being solved:**
- Manual notebook tracking is error-prone and hard to search/summarize
- No easy way to see how much money is still owed by customers ("baaki paisa")
- No visibility into profit vs. running cost of the tractor

**Business model:** Multi-tenant SaaS — many tractor owners, each with their own
account and completely isolated data.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server Actions keep sensitive queries off the client; native Vercel deploy; good perf on weak rural mobile networks |
| Backend/DB | Supabase (Postgres + Auth) | Built-in Row Level Security for multi-tenancy; instant REST/JS client; free tier is enough to start |
| Auth | Supabase Auth — Email + Password, with "Forgot password" reset flow | Per requirement |
| Hosting | Vercel | Zero-config Next.js deploy, free tier, fast edge network |
| Styling | Tailwind CSS + CSS variables for theme tokens | Fast to build, easy dark/light mode via variables |
| Charts | Lightweight custom SVG/CSS charts (no heavy chart library) | Keep bundle small for low-bandwidth users |
| State | React Server Components + minimal client state (no Redux needed) | App is CRUD-heavy, not state-heavy |

---

## 3. Design System

**Concept:** The dashboard's pending-balance card is styled like a torn ledger-page
corner — a visual bridge between the paper notebook this app replaces and the new
digital tool. This is the one signature visual moment; everything else stays quiet
and functional.

**Colors**
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#2F4A3B` | Primary (paddy-field green) — headers, primary buttons |
| `--ink-dark` | `#141C17` | Dark mode background |
| `--harvest` | `#C99A3C` | Income accent (harvest gold) |
| `--rust` | `#A8503F` | Expense / pending-balance accent (muted terracotta) |
| `--bg-light` | `#F6F4EE` | Light mode background |
| `--surface-light` | `#FFFFFF` | Cards on light mode |
| `--surface-dark` | `#1E2A22` | Cards on dark mode |
| `--text-muted` | `#6B7A70` | Secondary text |

**Typography**
- Display / big numbers: `DM Serif Display` (English only — used for hero balance figure)
- UI + body (English & Assamese): `Hind Siliguri` (renders both scripts cleanly, avoids font-swap flicker)
- Tabular figures (amounts in lists/tables): `JetBrains Mono` for column alignment

**Layout:** Mobile-first single column, sticky bottom nav bar (4 icons: Dashboard,
Add, History, Settings), top app bar with app name + language/theme toggles.

---

## 4. Database Schema (Supabase / Postgres)

```sql
-- Extends Supabase auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_language text default 'en' check (preferred_language in ('en','as')),
  theme_preference text default 'light' check (theme_preference in ('light','dark')),
  created_at timestamptz default now()
);

create table income_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  description text not null,
  total_amount numeric(10,2) not null,
  amount_received numeric(10,2) not null default 0,
  balance numeric(10,2) generated always as (total_amount - amount_received) stored,
  payment_mode text not null check (payment_mode in ('cash','upi','bank_transfer','other')),
  customer_name text,
  village text,
  land_area text,
  created_at timestamptz default now()
);

create table expense_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  category text not null check (category in ('fuel','driver','helper','repair_maintenance')),
  amount numeric(10,2) not null,
  description text,
  created_at timestamptz default now()
);

create index idx_income_owner_date on income_entries(owner_id, entry_date desc);
create index idx_expense_owner_date on expense_entries(owner_id, entry_date desc);
```

**Row Level Security (critical for multi-tenancy):**

```sql
alter table profiles enable row level security;
alter table income_entries enable row level security;
alter table expense_entries enable row level security;

create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

create policy "Users manage own income" on income_entries
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage own expenses" on expense_entries
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
```

> ⚠️ Test RLS thoroughly with two separate test accounts before shipping —
> confirm Account A can never read/write Account B's rows under any query path.

---

## 5. Screens

### 5.1 Public (unauthenticated)
1. **Landing Page** — what the app does, who it's for, screenshots/mockup of
   dashboard, "Get Started" CTA → Signup. Available in English/Assamese toggle
   even pre-login.
2. **Signup** — full name, email, password, confirm password
3. **Login** — email, password, "Forgot password?" link
4. **Forgot / Reset Password** — email entry → Supabase reset email → new password form

### 5.2 Authenticated
5. **Dashboard** (default landing after login)
   - Date range filter: This Week / This Month / This Season / Custom
   - 4 summary cards: Total Income, Total Expense, Net Profit, **Pending Balance** (signature ledger-corner styled card)
   - Expense breakdown (donut/bar: Fuel / Driver / Helper / Repair)
   - Income vs Expense trend (simple bar comparison, daily or weekly)
   - Pending Payments list (customer/village + amount owed, sorted by oldest first)
   - Recent Transactions (last 10, mixed income+expense, tap to edit)
6. **Add Income** — date, description, total amount, amount received (balance
   auto-calculated live), payment mode, optional: customer name, village, land area
7. **Add Expense** — date, category (fuel/driver/helper/repair), amount, description
8. **History / All Entries** — full list, filter by type (income/expense/all) and
   date range, search, edit/delete each entry
9. **Settings**
   - Language toggle (English / Assamese)
   - Theme toggle (Light / Dark)
   - Profile (name, email, change password)
   - **About** — what the app is, version info
   - **Help** — how to add entries, how balance/pending works, contact/support info

---

## 6. Internationalization (i18n)

- Default language: **English**. Toggle switches entire UI to **Assamese** —
  no mixed-language labels ever (per requirement, no Hinglish-style mixing).
- Store all UI strings in a single translation dictionary (`en` / `as` keys),
  e.g. `lib/i18n.ts` with a `t(key, lang)` helper.
- User-entered data (descriptions, customer names) stays exactly as typed —
  i18n only applies to app chrome (labels, buttons, headers, messages).
- Store the user's language preference in `profiles.preferred_language` so it
  persists across devices/sessions.
- **Note:** the Assamese translations below are a first-pass draft — have a
  native speaker review before shipping, since financial/legal terms need to be precise:

| English | Assamese (draft) |
|---|---|
| Dashboard | ডেচব'ৰ্ড |
| Add Income | আয় যোগ কৰক |
| Add Expense | খৰচ যোগ কৰক |
| History | ইতিহাস |
| Settings | ছেটিংছ |
| Total Income | মুঠ আয় |
| Total Expense | মুঠ খৰচ |
| Net Profit | নীট লাভ |
| Pending Balance | বাকী থকা ধন |
| Date | তাৰিখ |
| Description | বিৱৰণ |
| Total Amount | মুঠ ধন |
| Amount Received | পোৱা ধন |
| Balance | বাকী |
| Payment Mode | পৰিশোধৰ ধৰণ |
| Customer Name | গ্ৰাহকৰ নাম |
| Village | গাঁও |
| Land Area | মাটিৰ পৰিমাণ |
| Fuel | জ্বালানী |
| Driver | চালক |
| Helper | সহায়ক |
| Repair/Maintenance | মেৰামতি |
| Save | সাঁচি থওক |
| Cancel | বাতিল কৰক |
| Edit | সম্পাদনা কৰক |
| Delete | মচি পেলাওক |
| Light Mode / Dark Mode | পোহৰ ম'ড / আন্ধাৰ ম'ড |
| About | বিষয়ে |
| Help | সহায় |
| No entries yet | এতিয়ালৈকে কোনো প্ৰবিষ্টি নাই |

---

## 7. Folder Structure (Next.js App Router)

```
tractor-hisaab/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # Landing page
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (app)/                      # Auth-protected group
│   │   ├── layout.tsx              # Bottom nav + top bar shell
│   │   ├── dashboard/page.tsx
│   │   ├── add-income/page.tsx
│   │   ├── add-expense/page.tsx
│   │   ├── history/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── about/page.tsx
│   │       └── help/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                         # buttons, cards, inputs
│   ├── dashboard/                  # summary cards, charts, pending list
│   └── forms/                      # income/expense form components
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # browser client
│   │   ├── server.ts               # server client (Server Actions/RSC)
│   │   └── middleware.ts           # session refresh middleware
│   ├── i18n.ts
│   └── actions/                    # Server Actions (add/edit/delete entries)
├── middleware.ts                   # protects (app) routes, redirects to /login
├── supabase/
│   └── schema.sql                  # the SQL from Section 4
├── .env.local.example
└── package.json
```

---

## 8. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
(No service-role key needed client-side; all writes go through RLS-protected
authenticated requests.)

---

## 9. Build Order (recommended sequence for the coding model)

1. Scaffold Next.js project, Tailwind, folder structure
2. Set up Supabase project → run `schema.sql` → verify RLS policies with two test users
3. Auth: signup, login, forgot/reset password, session middleware
4. Landing page (bilingual)
5. App shell: bottom nav, top bar, theme toggle, language toggle (wired to `profiles`)
6. Add Income form → Server Action → insert into `income_entries`
7. Add Expense form → Server Action → insert into `expense_entries`
8. Dashboard: summary card queries, expense breakdown, pending balance list, recent transactions
9. History page: combined list, filters, edit/delete
10. Settings: profile edit, password change, About, Help
11. Mobile responsiveness pass + dark mode pass across every screen
12. Deploy to Vercel, connect env vars, test on an actual Android phone over mobile data

---

## 10. Open Items to Decide Later (not blocking initial build)

- Payment modes list (`cash`, `upi`, `bank_transfer`, `other`) — confirm this covers real usage
- Whether "This Season" date range needs a configurable season start/end date per owner
- Export data (CSV/PDF) — not in v1 scope, flagged for later
- Push notifications for pending payment follow-ups — not in v1 scope
