-- Fix admin bootstrap for production owner account
update public.profiles
set role = 'admin'
where username = 'clashanimeteam'
   or id = 'e0399a69-015b-4b18-bdc8-3e790fba2f04';

update public.profiles
set role = 'admin'
where username ilike 'wisam'
  and role <> 'admin';
