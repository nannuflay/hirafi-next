-- Replaces the trigger function with a CASE-based category resolver
-- (no exception/catch needed) and adds ON CONFLICT guards to both inserts.
-- Also handles the legacy camelCase 'applianceRepair' key in case it was
-- stored before the frontend fix.
-- All types use public. prefix so the Auth API (different search_path) can resolve them.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role     public.user_role;
  v_category public.service_category;
  v_rate     NUMERIC;
BEGIN
  v_role := (new.raw_user_meta_data->>'role')::public.user_role;

  INSERT INTO public.profiles (id, role, full_name, phone, city)
  VALUES (
    new.id,
    v_role,
    new.raw_user_meta_data->>'full_name',
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'phone', '')), ''),
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'city',  '')), '')
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'vendor' THEN
    v_category := CASE LOWER(TRIM(COALESCE(new.raw_user_meta_data->>'category', '')))
      WHEN 'transport'        THEN 'transport'::public.service_category
      WHEN 'appliance_repair' THEN 'appliance_repair'::public.service_category
      WHEN 'appliancerepair'  THEN 'appliance_repair'::public.service_category
      WHEN 'plumbing'         THEN 'plumbing'::public.service_category
      WHEN 'electricity'      THEN 'electricity'::public.service_category
      WHEN 'carpentry'        THEN 'carpentry'::public.service_category
      WHEN 'painting'         THEN 'painting'::public.service_category
      WHEN 'cleaning'         THEN 'cleaning'::public.service_category
      ELSE                         'other'::public.service_category
    END;

    BEGIN
      v_rate := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'rate', '')), '')::NUMERIC;
    EXCEPTION WHEN OTHERS THEN
      v_rate := NULL;
    END;

    INSERT INTO public.vendor_services (vendor_id, category, bio, rate)
    VALUES (
      new.id,
      v_category,
      NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'bio', '')), ''),
      v_rate
    )
    ON CONFLICT (vendor_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
