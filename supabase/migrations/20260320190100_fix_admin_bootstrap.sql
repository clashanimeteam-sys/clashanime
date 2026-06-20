-- Ensure site owner keeps admin access
update public.profiles
set role = 'admin'
where username ilike 'wisam';
