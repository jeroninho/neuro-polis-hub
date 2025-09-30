-- Add phone column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update the handle_new_user function to also save the phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;
