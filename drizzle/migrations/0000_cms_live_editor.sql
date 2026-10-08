CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE public.cms_admins (
  username text PRIMARY KEY,
  password_hash text NOT NULL
);
GRANT ALL ON public.cms_admins TO service_role;
ALTER TABLE public.cms_admins ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cms_sessions (
  token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL REFERENCES public.cms_admins(username) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days'
);
GRANT ALL ON public.cms_sessions TO service_role;
ALTER TABLE public.cms_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cms_login_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.cms_login_attempts TO service_role;
ALTER TABLE public.cms_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cms_content (
  page text NOT NULL,
  cms_id text NOT NULL,
  item jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (page, cms_id)
);
GRANT SELECT ON public.cms_content TO anon, authenticated;
GRANT ALL ON public.cms_content TO service_role;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Website content is public" ON public.cms_content FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.cms_admins (username, password_hash)
VALUES ('admin', '$2a$10$2zWGJ8YYR9rwKK43nvxlZeEyietpi9d1L2POe5N1mxYIcfsOandqy');

CREATE OR REPLACE FUNCTION public.cms_login(p_username text, p_password text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE v_hash text; v_token uuid;
BEGIN
  DELETE FROM cms_login_attempts WHERE created_at < now() - interval '15 minutes';
  IF (SELECT count(*) FROM cms_login_attempts) >= 30 THEN
    RAISE EXCEPTION 'too many attempts';
  END IF;
  SELECT password_hash INTO v_hash FROM cms_admins WHERE username = lower(trim(p_username));
  IF v_hash IS NULL OR extensions.crypt(p_password, v_hash) <> v_hash THEN
    INSERT INTO cms_login_attempts DEFAULT VALUES;
    RETURN NULL;
  END IF;
  DELETE FROM cms_sessions WHERE expires_at < now();
  INSERT INTO cms_sessions (username) VALUES (lower(trim(p_username))) RETURNING token INTO v_token;
  RETURN v_token;
END $$;

CREATE OR REPLACE FUNCTION public.cms_check(p_token uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM cms_sessions WHERE token = p_token AND expires_at > now())
$$;

CREATE OR REPLACE FUNCTION public.cms_logout(p_token uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM cms_sessions WHERE token = p_token
$$;

CREATE OR REPLACE FUNCTION public.cms_save(p_token uuid, p_page text, p_items jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_item jsonb; n integer := 0;
BEGIN
  IF NOT public.cms_check(p_token) THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF p_page !~ '^[a-z0-9-]{1,60}$' OR jsonb_typeof(p_items) <> 'array' THEN RAISE EXCEPTION 'invalid input'; END IF;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    IF coalesce(v_item->>'cms_id', '') = '' OR length(v_item->>'cms_id') > 500 THEN CONTINUE; END IF;
    INSERT INTO cms_content (page, cms_id, item, updated_at)
    VALUES (p_page, v_item->>'cms_id', v_item, now())
    ON CONFLICT (page, cms_id) DO UPDATE SET item = EXCLUDED.item, updated_at = now();
    n := n + 1;
  END LOOP;
  RETURN n;
END $$;

REVOKE ALL ON FUNCTION public.cms_login(text, text), public.cms_check(uuid), public.cms_logout(uuid), public.cms_save(uuid, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cms_login(text, text), public.cms_check(uuid), public.cms_logout(uuid), public.cms_save(uuid, text, jsonb) TO anon, authenticated;