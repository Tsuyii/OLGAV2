-- Auto-create a profile row whenever a user signs up in auth.users.
-- Runs as security definer so it bypasses RLS — works even before email confirmation.
-- Reads first_name / last_name from user_metadata set during signUp().

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_first text;
  v_last  text;
begin
  v_first := coalesce(
    nullif(trim(new.raw_user_meta_data->>'first_name'), ''),
    split_part(coalesce(trim(new.raw_user_meta_data->>'full_name'), ''), ' ', 1),
    ''
  );
  v_last := coalesce(
    nullif(trim(new.raw_user_meta_data->>'last_name'), ''),
    nullif(
      trim(substr(
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        length(split_part(coalesce(new.raw_user_meta_data->>'full_name', ''), ' ', 1)) + 2
      )),
      ''
    ),
    ''
  );

  insert into public.profiles (id, email, first_name, last_name, full_name, newsletter_opt_in)
  values (
    new.id,
    new.email,
    v_first,
    v_last,
    trim(v_first || ' ' || v_last),
    false
  )
  on conflict (id) do update set
    email      = excluded.email,
    first_name = case when excluded.first_name <> '' then excluded.first_name else profiles.first_name end,
    last_name  = case when excluded.last_name  <> '' then excluded.last_name  else profiles.last_name  end,
    full_name  = case when excluded.full_name  <> '' then excluded.full_name  else profiles.full_name  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
