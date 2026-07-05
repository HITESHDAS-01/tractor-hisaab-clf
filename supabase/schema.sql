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

-- Row Level Security (critical for multi-tenancy)
alter table profiles enable row level security;
alter table income_entries enable row level security;
alter table expense_entries enable row level security;

create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

create policy "Users manage own income" on income_entries
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage own expenses" on expense_entries
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
