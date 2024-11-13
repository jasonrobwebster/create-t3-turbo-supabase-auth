-- adds supabase users to user table on new user creation
CREATE
OR REPLACE FUNCTION public.sync_users() RETURNS TRIGGER AS $$ 
BEGIN
INSERT INTO
    "public"."user" (id, name, image)
VALUES
    (
        NEW.id,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

RETURN NEW;

END;

$$ 
LANGUAGE plpgsql 
SECURITY definer set search_path = '';

CREATE TRIGGER sync_auth_users
AFTER
INSERT
    ON auth.users FOR EACH ROW EXECUTE FUNCTION public.sync_users();