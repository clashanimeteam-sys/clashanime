-- Refresh PostgREST schema cache so clash_coins column is visible to the API.
NOTIFY pgrst, 'reload schema';
