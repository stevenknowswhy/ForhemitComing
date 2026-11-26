-- OD-13 CRM schema (Twenty-like CRM in /admin/crm).
-- Run once in the Supabase SQL editor (dashboard) by Stefano; the service
-- role cannot execute DDL. Tables are Twenty-vocabulary: people, companies,
-- opportunities, notes. RLS is enabled with no policies: anon/authenticated
-- clients are denied everything; the service role (used only server-side)
-- bypasses RLS. No new grants are issued.

create extension if not exists pgcrypto;

-- ── updated_at trigger ──────────────────────────────────────────────────────

create or replace function crm_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── crm_companies ───────────────────────────────────────────────────────────

create table if not exists crm_companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  domain      text,
  industry    text,
  city        text,
  state       text,
  source      text not null default 'manual',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger crm_companies_set_updated_at
  before update on crm_companies
  for each row execute function crm_set_updated_at();

-- ── crm_people ──────────────────────────────────────────────────────────────

create table if not exists crm_people (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text,
  email       text,
  phone       text,
  job_title   text,
  company_id  uuid references crm_companies (id) on delete set null,
  source      text not null default 'manual',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists crm_people_company_id_idx on crm_people (company_id);

create trigger crm_people_set_updated_at
  before update on crm_people
  for each row execute function crm_set_updated_at();

-- ── crm_opportunities ───────────────────────────────────────────────────────
-- Stage union mirrors the ESOP-style pipeline stages (prospect → … → dormant)
-- used across the admin; see packages/shared/src/features/crm/records/constants.ts.

create table if not exists crm_opportunities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  stage       text not null default 'prospect'
              check (stage in ('prospect', 'introduced', 'active', 'preferred', 'dormant')),
  amount      numeric(14, 2),
  close_date  date,
  person_id   uuid references crm_people (id) on delete set null,
  company_id  uuid references crm_companies (id) on delete set null,
  source      text not null default 'manual',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists crm_opportunities_person_id_idx on crm_opportunities (person_id);
create index if not exists crm_opportunities_company_id_idx on crm_opportunities (company_id);
create index if not exists crm_opportunities_stage_idx on crm_opportunities (stage);

create trigger crm_opportunities_set_updated_at
  before update on crm_opportunities
  for each row execute function crm_set_updated_at();

-- ── crm_notes ───────────────────────────────────────────────────────────────
-- A note attaches to exactly one record (person, company, or opportunity);
-- deleting the record deletes its notes.

create table if not exists crm_notes (
  id              uuid primary key default gen_random_uuid(),
  body            text not null,
  person_id       uuid references crm_people (id) on delete cascade,
  company_id      uuid references crm_companies (id) on delete cascade,
  opportunity_id  uuid references crm_opportunities (id) on delete cascade,
  source          text not null default 'manual',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint crm_notes_one_target check (num_nonnulls(person_id, company_id, opportunity_id) = 1)
);

create index if not exists crm_notes_person_id_idx on crm_notes (person_id);
create index if not exists crm_notes_company_id_idx on crm_notes (company_id);
create index if not exists crm_notes_opportunity_id_idx on crm_notes (opportunity_id);

create trigger crm_notes_set_updated_at
  before update on crm_notes
  for each row execute function crm_set_updated_at();

-- ── Row level security ──────────────────────────────────────────────────────
-- Enabled with zero policies: the API is server-only (service role bypasses
-- RLS), and no anon/authenticated client ever talks to Supabase directly.

alter table crm_companies     enable row level security;
alter table crm_people        enable row level security;
alter table crm_opportunities enable row level security;
alter table crm_notes         enable row level security;
