-- ==============================================================================
-- Digital Evidence Integrity System (DEIS)
-- Supabase Free Cloud Database Schema (PostgreSQL)
-- FIPS 180-4 / FRE 902(14) Compliant Relational Store
-- ==============================================================================
-- Instructions:
-- 1. Create a free project at https://supabase.com
-- 2. Go to "SQL Editor" in your Supabase dashboard
-- 3. Paste this entire script and click "Run"
-- 4. Copy your Project URL & Anon Key from Project Settings -> API
-- 5. Paste them into the DEIS "Connect Supabase" modal in your browser!
-- ==============================================================================

-- 1. CASES TABLE
create table if not exists deis_cases (
  id text primary key,
  case_number text unique not null,
  title text not null,
  category text,
  lead_agency text,
  lead_agency_name text,
  investigating_officer text,
  court_jurisdiction text,
  status text default 'ACTIVE_INVESTIGATION',
  opened_date text,
  storage_folder text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. EVIDENCE ARTIFACTS TABLE
create table if not exists deis_evidence (
  id text primary key,
  case_id text references deis_cases(id) on delete set null,
  case_number text not null,
  case_title text,
  title text not null,
  category text,
  file_type text,
  file_size text,
  file_name text,
  stored_file_path text,
  seizure_date text,
  seizure_location text,
  source_device text,
  current_custodian text,
  custodian_agency text,
  status text default 'IN_VAULT',
  sha256 text not null,
  sha512 text,
  digital_seal text,
  classification text,
  tags jsonb default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CUSTODY TRANSFERS TABLE
create table if not exists deis_transfers (
  transfer_id text primary key,
  item_type text default 'EVIDENCE_ARTIFACT',
  evidence_id text references deis_evidence(id) on delete cascade,
  evidence_title text,
  report_id text,
  report_title text,
  from_agency text not null,
  to_agency text not null,
  initiator_officer text not null,
  recipient_officer text not null,
  purpose text,
  transfer_mode text,
  handoff_token text not null,
  sender_signature text,
  recipient_signature text,
  status text default 'PENDING_ACCEPTANCE',
  dispatch_time text,
  accepted_time text,
  integrity_verified boolean default true,
  transfer_manifest_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CRYPTOGRAPHIC CHAIN OF CUSTODY BLOCKS TABLE
create table if not exists deis_chain_blocks (
  block_height integer primary key,
  block_hash text unique not null,
  previous_hash text not null,
  timestamp text not null,
  event_type text not null,
  evidence_id text,
  case_id text,
  agency text,
  officer text,
  action_description text,
  evidence_hash text,
  merkle_root text,
  signature text,
  tampered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. FORENSIC EXAMINATION REPORTS TABLE
create table if not exists deis_forensic_reports (
  report_id text primary key,
  evidence_id text not null,
  case_number text not null,
  title text not null,
  examiner_name text not null,
  examiner_badge text not null,
  laboratory_name text not null,
  author_agency_id text not null,
  examination_date text,
  hardware_profile text,
  tool_chain text,
  findings text,
  conclusion text,
  integrity_verified boolean default true,
  report_signature text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SYSTEM USERS & PERSONNEL TABLE
create table if not exists deis_users (
  id text primary key,
  name text not null,
  badge_id text unique not null,
  email text,
  agency_id text not null,
  agency_name text,
  job_title text,
  clearance_level text,
  initials text,
  color text,
  icon text,
  password text,
  department text,
  security_token text,
  is_admin boolean default false,
  created_at text,
  last_login text
);

-- 7. AUDIT LOGS TABLE
create table if not exists deis_audit_logs (
  id bigserial primary key,
  action text not null,
  target_id text,
  target_type text,
  details text,
  timestamp text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW ANON/PUBLIC ACCESS
-- ==============================================================================
alter table deis_cases enable row level security;
drop policy if exists "deis_cases_policy" on deis_cases;
create policy "deis_cases_policy" on deis_cases for all using (true) with check (true);

alter table deis_evidence enable row level security;
drop policy if exists "deis_evidence_policy" on deis_evidence;
create policy "deis_evidence_policy" on deis_evidence for all using (true) with check (true);

alter table deis_transfers enable row level security;
drop policy if exists "deis_transfers_policy" on deis_transfers;
create policy "deis_transfers_policy" on deis_transfers for all using (true) with check (true);

alter table deis_chain_blocks enable row level security;
drop policy if exists "deis_chain_blocks_policy" on deis_chain_blocks;
create policy "deis_chain_blocks_policy" on deis_chain_blocks for all using (true) with check (true);

alter table deis_forensic_reports enable row level security;
drop policy if exists "deis_forensic_reports_policy" on deis_forensic_reports;
create policy "deis_forensic_reports_policy" on deis_forensic_reports for all using (true) with check (true);

alter table deis_users enable row level security;
drop policy if exists "deis_users_policy" on deis_users;
create policy "deis_users_policy" on deis_users for all using (true) with check (true);

alter table deis_audit_logs enable row level security;
drop policy if exists "deis_audit_logs_policy" on deis_audit_logs;
create policy "deis_audit_logs_policy" on deis_audit_logs for all using (true) with check (true);

-- ==============================================================================
-- 8. EVIDENCE VAULT STORAGE BUCKET (OPTIONAL FILE BLOB STORAGE)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('evidence_vault', 'evidence_vault', true)
on conflict (id) do nothing;

drop policy if exists "evidence_vault_storage_policy" on storage.objects;
create policy "evidence_vault_storage_policy" on storage.objects for all using (bucket_id = 'evidence_vault') with check (bucket_id = 'evidence_vault');
