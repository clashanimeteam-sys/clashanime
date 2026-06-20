-- Hunter rank point thresholds:
-- E: 0-999 | C: 1000-4999 | A: 5000-9999 | S: 9999+

create or replace function public.points_to_level(target_points integer)
returns smallint
language plpgsql
immutable
as $$
begin
  if target_points >= 9999 then
    return 4;
  elsif target_points >= 5000 then
    return 3;
  elsif target_points >= 1000 then
    return 2;
  end if;

  return 1;
end;
$$;

update public.profiles
set level = public.points_to_level(coalesce(points, 0))
where true;
