-- Supabase schema for Kahoot Clone
-- Run this in Supabase SQL Editor

create table rooms (
  id text primary key,
  code text unique not null,
  host_id text not null,
  status text not null default 'lobby',
  max_players integer not null,
  current_question_index integer default 0,
  scores jsonb default '{}',
  answers jsonb default '{}',
  questions jsonb,
  players jsonb default '[]',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_rooms_code on rooms (code);
create index idx_rooms_status on rooms (status);
