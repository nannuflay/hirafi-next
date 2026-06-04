-- Extends the profile trigger to store phone + city, and auto-create
-- vendor_services when a new vendor signs up.
-- All extra fields are passed via raw_user_meta_data during signUp().

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role          user_role;
  v_category      service_category;
  v_rate          NUMERIC;
BEGIN
  v_role := (new.raw_user_meta_data->>'role')::user_role;

  INSERT INTO public.profiles (id, role, full_name, phone, city)
  VALUES (
    new.id,
    v_role,
    new.raw_user_meta_data->>'full_name',
    NULLIF(TRIM(new.raw_user_meta_data->>'phone'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'city'),  '')
  );

  IF v_role = 'vendor' THEN
    -- Resolve category, defaulting to 'other' if missing/invalid.
    BEGIN
      v_category := (new.raw_user_meta_data->>'category')::service_category;
    EXCEPTION WHEN invalid_text_representation THEN
      v_category := 'other';
    END;

    IF v_category IS NULL THEN
      v_category := 'other';
    END IF;

    v_rate := NULLIF(TRIM(new.raw_user_meta_data->>'rate'), '')::NUMERIC;

    INSERT INTO public.vendor_services (vendor_id, category, bio, rate)
    VALUES (
      new.id,
      v_category,
      NULLIF(TRIM(new.raw_user_meta_data->>'bio'), ''),
      v_rate
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
