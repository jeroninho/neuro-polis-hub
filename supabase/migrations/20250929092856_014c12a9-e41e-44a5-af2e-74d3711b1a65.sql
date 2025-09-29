-- Remover policies existentes se existirem e recriar
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles; 
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Criar policies para que admins possam gerenciar cursos
CREATE POLICY "Admins can manage courses"
ON public.courses
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Criar policies para que admins possam gerenciar artigos
CREATE POLICY "Admins can manage articles"
ON public.articles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Criar policy para que admins possam acessar todos os profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));