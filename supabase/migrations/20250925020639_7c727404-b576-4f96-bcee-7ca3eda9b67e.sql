-- Garantir que existe um usuário admin
-- Vamos criar o usuário admin de forma mais simples

-- Primeiro, garantir que qualquer usuário existente pode ser promovido a admin
-- Vamos pegar o primeiro usuário existente e torná-lo admin
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Pegar o primeiro usuário que existe
    SELECT user_id INTO first_user_id 
    FROM public.profiles 
    LIMIT 1;
    
    -- Se existe um usuário, torná-lo admin
    IF first_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (first_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;