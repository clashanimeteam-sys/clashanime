-- Reload PostgREST schema so seasonal_lineup is exposed to the API

notify pgrst, 'reload schema';
