-- list registered users

create or replace view listUsers as
select ui.id, ui.name, ui.surname, au.email, ui.phone, ui.room, ui.confirmed, ui.disabled
from auth.users au
left join user_info ui 
on ui.uuid = au.id

-- list all users including unregistered (pivo recimo)

create or replace view listAllUsers as
select ui.id, ui.name, ui.surname, au.email, ui.phone, ui.room, ui.confirmed, ui.disabled
from  user_info ui
left join auth.users au
on ui.uuid = au.id

-- get all termins by userid

create or replace function getTerminsByUid(u_id int8)
returns table (
  id int8,
  user_id int8,
  washer int8,
  created_at timestamp with time zone,
  start_at timestamp with time zone,
  end_at timestamp with time zone
)
AS $$
begin
  return query
  select 
    t.id as id, 
    t.user_id as user_id,
    t.washer as washer,
    t.created_at as created_at, 
    t.start_at as start_at, 
    t.end_at as end_at
  from termins t
  where t.user_id = u_id;
end;
$$
language plpgsql;

-- get all termins by userid that (params: active = true => are still active)

create or replace function getTerminsByUid(u_id int8, active bool)
returns table (
  id int8,
  user_id int8,
  washer int8,
  created_at timestamp with time zone,
  start_at timestamp with time zone,
  end_at timestamp with time zone
)
AS $$
begin
  if active then
    return query
    select 
      t.id as id, 
      t.user_id as user_id,
      t.washer as washer,
      t.created_at as created_at, 
      t.start_at as start_at, 
      t.end_at as end_at
    from termins t
    where t.user_id = u_id and t.end_at >= now();
  else
    return query
    select 
      t.id as id, 
      t.user_id as user_id,
      t.washer as washer,
      t.created_at as created_at, 
      t.start_at as start_at, 
      t.end_at as end_at
    from termins t
    where t.user_id = u_id;
  end if;
end;
$$
language plpgsql;

-- get all termins withing a month (params: month(jan=1), year)

create or replace function getTerminsMonthYear(month int8, year int8)
returns table (
  id int8,
  user_id int8,
  washer int8,
  created_at timestamp with time zone,
  start_at timestamp with time zone,
  end_at timestamp with time zone
)
as $$
begin
  return query
  select 
    t.id as id,
    t.user_id as user_id,
    t.washer as washer,
    t.created_at as created_at, 
    t.start_at as start_at, 
    t.end_at as end_at
  from termins t
  where 
    EXTRACT(month from t.start_at) = month
    and EXTRACT(year from t.start_at) = year;
end;
$$
language plpgsql;

-- get termins between two dates

create or replace function getTerminsInRange(start timestamp with time zone, stop timestamp with time zone)
returns table (
  id int8,
  user_id int8,
  washer int8,
  created_at timestamp with time zone,
  start_at timestamp with time zone,
  end_at timestamp with time zone
)
as $$
begin
  return query
  select 
    t.id as id,
    t.user_id as user_id,
    t.washer as washer,
    t.created_at as created_at, 
    t.start_at as start_at, 
    t.end_at as end_at
  from termins t
  where 
    t.start_at >= start and
    t.end_at < stop;
end;
$$
language plpgsql;

-- get user by id

create or replace function getUserById(uid int8)
returns table(
  id int8,
  uuid uuid,
  name text,
  surname text,
  email varchar,
  room int8,
  phone text,
  confirmed boolean,
  disabled boolean,
  created_at timestamp with time zone,
  last_sign_in_at timestamp with time zone
) as $$
begin
  return query
  select 
    ui.id as id,
    au.id as uuid,
    ui.name as name,
    ui.surname as surname,
    au.email as email,
    ui.room as room,
    ui.phone as phone,
    ui.confirmed as confirmed,
    ui.disabled as disabled,
    au.created_at as created_at,
    au.last_sign_in_at as last_sign_in_at
  from user_info ui
  left join auth.users au
  on ui.uuid = au.id
  where ui.id = uid;
end;
$$ language plpgsql;

-- edit user (all parameters are optional except id)

create or replace function editUser(
  param_id bigint, 
  param_name text default null,
  param_surname text default null,
  param_email text default null,
  param_room bigint default null,
  param_phone text default null,
  param_disabled boolean default null,
  param_confirmed boolean default null)
returns void 
security definer
as $$
begin
  begin
    update user_info set 
    name = coalesce(param_name, name),
    surname = coalesce(param_surname, surname),
    room = coalesce(param_room, room),
    phone = coalesce(param_phone, phone),
    disabled = coalesce(param_disabled, disabled),
    confirmed = coalesce(param_confirmed, confirmed)
    where id = param_id;

    update auth.users set
    email = coalesce(param_email, email),
    phone = coalesce(param_phone, phone)
    where id = (
      select uuid 
      from user_info
      where id = param_id
    );
  end;
end;
$$ language plpgsql
