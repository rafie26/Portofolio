-- Portfolio content (single row) - editable text & images via dashboard
create table if not exists public.portfolio_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

-- Public read: portfolio content is public-facing
create policy "public read portfolio_content"
  on public.portfolio_content for select
  using (true);

-- Public bucket for uploaded images (served directly via public URL)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "public read portfolio bucket"
  on storage.objects for select
  using (bucket_id = 'portfolio');
