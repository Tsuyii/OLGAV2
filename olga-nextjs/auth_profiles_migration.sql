-- Adds profile personalization columns required by auth module.
-- Safe to run on existing projects already using `profiles`.

alter table if exists public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists email text,
  add column if not exists newsletter_opt_in boolean default false;

update public.profiles
set first_name = coalesce(first_name, split_part(coalesce(full_name, ''), ' ', 1)),
    last_name = coalesce(last_name, nullif(substr(coalesce(full_name, ''), length(split_part(coalesce(full_name, ''), ' ', 1)) + 2), '')),
    email = coalesce(email, (select au.email from auth.users au where au.id = profiles.id))
where first_name is null or last_name is null or email is null;

alter table if exists public.profiles
  alter column first_name set not null,
  alter column last_name set not null,
  alter column email set not null;

-- Keep `full_name` in sync for legacy consumers.
create or replace function public.sync_profile_full_name()
returns trigger
language plpgsql
as $$
begin
  new.full_name := trim(coalesce(new.first_name, '') || ' ' || coalesce(new.last_name, ''));
  return new;
end;
$$;

drop trigger if exists trg_sync_profile_full_name on public.profiles;
create trigger trg_sync_profile_full_name
before insert or update of first_name, last_name on public.profiles
for each row execute function public.sync_profile_full_name();

alter table if exists public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own'
  ) then
    create policy profiles_select_own
      on public.profiles for select
      using (auth.uid() = id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_insert_own'
  ) then
    create policy profiles_insert_own
      on public.profiles for insert
      with check (auth.uid() = id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own'
  ) then
    create policy profiles_update_own
      on public.profiles for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end
$$;
