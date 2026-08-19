-- Elite Web Designer — esquema do portfólio
-- Rodar em: Supabase → SQL Editor → New query → Run
--
-- Modelo de acesso:
--   • visitante anônimo  → lê apenas projetos com active = true
--   • usuário autenticado → lê, cria, edita e apaga
-- Nenhuma escrita é possível sem sessão, mesmo com a publishable key em mãos.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- tabela ----

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null check (length(trim(title)) > 0),
  category    text        not null check (length(trim(category)) > 0),
  year        smallint    not null check (year between 2000 and 2100),
  description text        not null default '',
  href        text,
  -- Caminho do arquivo no bucket `portfolio` (ex.: "reza-vela/capa.webp").
  -- A imagem em si vive no Storage; a tabela guarda só a referência.
  image_path  text        not null,
  active      boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_active_idx on public.projects (active, sort_order, created_at desc);

-- Mantém updated_at coerente sem depender do cliente.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------------- RLS ----

alter table public.projects enable row level security;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
  on public.projects for select
  to anon, authenticated
  using (active = true or auth.role() = 'authenticated');

drop policy if exists "projects_admin_insert" on public.projects;
create policy "projects_admin_insert"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "projects_admin_update" on public.projects;
create policy "projects_admin_update"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete"
  on public.projects for delete
  to authenticated
  using (true);

-- --------------------------------------------------------------- storage ----

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio_public_read" on storage.objects;
create policy "portfolio_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "portfolio_admin_write" on storage.objects;
create policy "portfolio_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio');

drop policy if exists "portfolio_admin_update" on storage.objects;
create policy "portfolio_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "portfolio_admin_delete" on storage.objects;
create policy "portfolio_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio');
