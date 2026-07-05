You are building a production-ready, mobile-first SaaS webapp called "Tractor Seva Hisaab."

A full specification is in `plan.md` in this project folder — read it completely before writing any code. It contains the product summary, tech stack, design system (colors/fonts/layout), full database schema with Row Level Security policies, all screens, i18n requirements, folder structure, and a recommended build order. Follow it exactly unless something is technically impossible, in which case flag the conflict before proceeding instead of silently deviating.

Build in the order given in Section 9 of plan.md, one step at a time:

1. Scaffold a Next.js 14+ App Router project with Tailwind CSS, matching the folder structure in Section 7.
2. Create the Supabase schema exactly as written in Section 4 (tables + indexes + RLS policies) as `supabase/schema.sql`. Do not weaken or simplify the RLS policies — every table must be owner-scoped.
3. Implement Supabase Auth: signup, login, forgot/reset password, and session-refresh middleware protecting all routes under the `(app)` route group. Unauthenticated users hitting any `(app)` route must redirect to `/login`.
4. Build the bilingual landing page (English default, Assamese toggle) per Section 5.1.
5. Build the authenticated app shell: sticky bottom nav (Dashboard / Add / History / Settings), top bar with language and theme toggles. Wire language and theme preference to the `profiles` table so they persist across sessions.
6. Build Add Income and Add Expense forms as Server Actions writing to `income_entries` / `expense_entries`. The balance field is a generated column — do not compute it manually. Show it live in the form as amount_received changes.
7. Build the Dashboard exactly per Section 5.2 #5: date range filter, the 4 summary cards (Income, Expense, Net Profit, and the ledger-corner-styled Pending Balance card described in Section 3), expense breakdown by category, an income-vs-expense trend comparison, a pending-payments list sorted oldest-first, and recent transactions.
8. Build History with type + date-range filtering, search, and edit/delete on every entry.
9. Build Settings: profile edit, change password, About, and Help screens.
10. Apply the full design system from Section 3 (colors, DM Serif Display / Hind Siliguri / JetBrains Mono, mobile-first single column) consistently across every screen, in both light and dark mode.
11. Implement i18n using the dictionary approach in Section 6 — every UI string must have both an `en` and `as` entry, with zero mixed-language strings. Use the draft Assamese table in Section 6 as the initial translations.
12. Do a full responsiveness and dark-mode pass across every single screen before considering it done — test at a narrow mobile viewport (~380px) as the primary target, not desktop.

Non-negotiable constraints:
- No mock/placeholder data left in the final build — every screen must read real data from Supabase.
- After implementing RLS, create two separate test accounts and verify neither can read, edit, or delete the other's rows through any screen or API call, before marking the backend done.
- Keep the JS bundle lean — no heavy chart libraries; build the dashboard charts with lightweight custom SVG/CSS as specified.
- Do not invent new screens, fields, or payment modes beyond what's in plan.md — if something seems missing, ask rather than assume.

Work through the steps sequentially and tell me clearly when each numbered step is complete before moving to the next one.
