-- Ensure site owner keeps admin access
update public.profiles
set role = 'admin'
where username in ('clashanimeteam', 'wisam')
   or id = 'e0399a69-015b-4b18-bdc8-3e790fba2f04';
