-- Elite Web Designer — esquema do portfólio
-- Rodar em: Supabase → SQL Editor → New query → Run
--
-- Modelo de acesso:
--   • visitante anônimo        → lê apenas projetos com active = true
--   • usuário autenticado      → nada além disso, por padrão
--   • usuário em public.admins → lê tudo, cria, edita e apaga
--
-- "Autenticado" NÃO é o mesmo que "administrador": enquanto o cadastro público
-- estiver aberto no projeto, qualquer pessoa consegue uma sessão válida. Por
-- isso a escrita depende de estar na lista explícita de administradores.
--
-- Este arquivo é idempotente: pode ser re-executado com segurança.

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

-- ------------------------------------------------------- administradores ----

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A lista de administradores não é enumerável pela API: cada um só se enxerga.
drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- security definer: a função precisa ler a tabela por baixo da própria RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Administradores atuais. Para liberar mais alguém, pegue o UID em
-- Authentication → Users e acrescente uma linha aqui.
insert into public.admins (user_id, note) values
  ('e4da495f-61c1-4284-b606-80191684140a', 'eliteprimestoreselite@gmail.com'),
  ('8de9c29e-2f8d-4561-8f71-ce70449491a1', 'tiago_carvalho07@yahoo.com.br')
on conflict (user_id) do nothing;

-- ------------------------------------------------------------------- RLS ----

alter table public.projects enable row level security;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
  on public.projects for select
  to anon, authenticated
  using (active = true or public.is_admin());

drop policy if exists "projects_admin_insert" on public.projects;
create policy "projects_admin_insert"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "projects_admin_update" on public.projects;
create policy "projects_admin_update"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

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
  with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "portfolio_admin_update" on storage.objects;
create policy "portfolio_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "portfolio_admin_delete" on storage.objects;
create policy "portfolio_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());
