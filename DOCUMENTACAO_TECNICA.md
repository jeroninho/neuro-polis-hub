# 📋 DOCUMENTAÇÃO TÉCNICA COMPLETA - ABNP Platform

## 🎯 **RESUMO EXECUTIVO**
Esta documentação fornece um guia completo para migração e manutenção do projeto ABNP (Academia Brasileira de Neurociência Política) em servidor próprio (self-hosted).

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **Stack Tecnológica**
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Query (@tanstack/react-query)
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Package Manager:** NPM/Yarn

### **Estrutura do Projeto**
```
ABNP-Platform/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Sistema de design (shadcn/ui)
│   │   ├── AdminSidebar.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── admin/          # Painel administrativo
│   │   ├── Index.tsx       # Landing page
│   │   ├── FreeCourse.tsx  # Cursos gratuitos
│   │   └── NotFound.tsx
│   ├── contexts/           # Context providers
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAdmin.ts
│   │   ├── useSupabaseData.ts
│   │   └── useVideoProgress.ts
│   ├── integrations/       # Integrações externas
│   │   └── supabase/
│   ├── lib/                # Utilitários
│   └── assets/             # Recursos estáticos
├── public/                 # Arquivos públicos
├── supabase/              # Configurações Supabase
└── package.json           # Dependências
```

---

## 🗄️ **BANCO DE DADOS (PostgreSQL via Supabase)**

### **Tabelas Principais**

#### **1. users (auth.users - Gerenciada pelo Supabase)**
- Tabela de autenticação gerenciada automaticamente

#### **2. profiles (public.profiles)**
- **Campos:**
  - `id` (uuid, PK) → Referência para auth.users
  - `user_id` (uuid, FK) → auth.users.id
  - `display_name` (text)
  - `email_notifications` (boolean)
  - `created_at`, `updated_at` (timestamps)

#### **3. user_roles (public.user_roles)**
- **Campos:**
  - `id` (uuid, PK)
  - `user_id` (uuid, FK) → auth.users.id
  - `role` (enum: 'admin', 'moderator', 'user')
  - `created_at`, `updated_at`

#### **4. courses (public.courses)**
- **Campos:**
  - `id` (uuid, PK)
  - `title` (text, NOT NULL)
  - `description` (text)
  - `youtube_url` (text)
  - `thumbnail_url` (text)
  - `duration_minutes` (integer)
  - `order_index` (integer)
  - `is_active` (boolean)
  - `created_at`, `updated_at`

#### **5. articles (public.articles)**
- **Campos:**
  - `id` (uuid, PK)
  - `title` (text, NOT NULL)
  - `content` (text)
  - `excerpt` (text)
  - `slug` (text)
  - `author` (text)
  - `featured_image_url` (text)
  - `external_url` (text)
  - `published_at` (timestamp)
  - `is_active` (boolean)
  - `created_at`, `updated_at`

#### **6. user_progress (public.user_progress)**
- **Campos:**
  - `id` (uuid, PK)
  - `user_id` (uuid, FK) → auth.users.id
  - `course_id` (uuid, FK) → courses.id
  - `current_video_id` (text)
  - `progress_percentage` (integer)
  - `last_position_seconds` (integer)
  - `watch_time_seconds` (integer)
  - `completed_at` (timestamp)
  - `created_at`

#### **7. video_sessions (public.video_sessions)**
- **Campos:**
  - `id` (uuid, PK)
  - `user_id` (uuid, FK) → auth.users.id
  - `video_id` (text)
  - `session_start`, `session_end` (timestamps)
  - `watch_time_seconds` (integer)
  - `last_position_seconds` (integer)
  - `video_duration_seconds` (integer)
  - `completion_percentage` (integer)
  - `completed` (boolean)
  - `created_at`, `updated_at`

#### **8. offers (public.offers)**
- **Campos:**
  - `id` (uuid, PK)
  - `title` (text, NOT NULL)
  - `description` (text)
  - `original_price`, `final_price`, `discount_amount` (numeric)
  - `discount_percentage` (integer)
  - `coupon_code` (text)
  - `external_url` (text)
  - `valid_from`, `valid_until` (timestamps)
  - `max_uses`, `current_uses` (integer)
  - `is_active` (boolean)
  - `created_at`, `updated_at`

#### **9. messages (public.messages)**
- **Campos:**
  - `id` (uuid, PK)
  - `title` (text, NOT NULL)
  - `content` (text, NOT NULL)
  - `sender_id` (uuid, FK) → auth.users.id
  - `recipient_id` (uuid, FK) → auth.users.id
  - `message_type` (text)
  - `is_read`, `is_broadcast` (boolean)
  - `target_audience` (jsonb)
  - `created_at`, `updated_at`

#### **10. campaigns (public.campaigns)**
- **Campos:**
  - `id` (uuid, PK)
  - `title` (text, NOT NULL)
  - `subject` (text, NOT NULL)
  - `content` (text, NOT NULL)
  - `created_by` (uuid, FK) → auth.users.id
  - `status` (text)
  - `template` (text)
  - `target_audience` (jsonb)
  - `scheduled_at`, `sent_at` (timestamps)
  - `sent_count`, `open_count`, `click_count` (integer)
  - `created_at`, `updated_at`

#### **11. settings (public.settings)**
- **Campos:**
  - `id` (uuid, PK)
  - `key` (text, NOT NULL)
  - `value` (jsonb)
  - `description` (text)
  - `created_at`, `updated_at`

### **Funções do Banco de Dados**

#### **1. has_role(_user_id uuid, _role app_role)**
```sql
-- Verifica se um usuário tem uma role específica
-- Usada nas políticas RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

#### **2. get_user_role(_user_id uuid)**
```sql
-- Retorna a role de maior privilégio do usuário
-- Ordem: admin > moderator > user
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'moderator' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1
$$;
```

#### **3. handle_new_user()**
```sql
-- Trigger executado quando novo usuário se cadastra
-- Cria perfil e atribui role padrão 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  -- Create default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;
```

### **Row Level Security (RLS)**
Todas as tabelas possuem políticas RLS configuradas:
- **Usuários comuns:** Acesso apenas aos próprios dados
- **Moderadores:** Acesso expandido conforme necessário
- **Administradores:** Acesso completo através da função `has_role()`

---

## 🔧 **CONFIGURAÇÃO DE AMBIENTE**

### **Variáveis de Ambiente (.env)**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui
VITE_SUPABASE_PROJECT_ID=seu_project_id

# Opcional - Integrações Futuras
YOUTUBE_API_KEY=sua_youtube_api_key
HOTMART_COURSE_URL=https://hotmart.com/pt-br/marketplace/produtos/metodo-neurocp
HOTMART_COUPON_CODE=ABNP10
BLOG_RSS_URL=https://academiadaneuropolitica.com.br/feed/
```

### **Dependências de Produção (package.json)**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "@tanstack/react-query": "^5.83.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "react-hook-form": "^7.61.1",
    "zod": "^3.25.76",
    "lucide-react": "^0.462.0",
    "tailwind-merge": "^2.6.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "class-variance-authority": "^0.7.1",
    "@radix-ui/react-slot": "^1.2.3"
  }
}
```

---

## 🚀 **DEPLOY E INFRAESTRUTURA**

### **Opção 1: Docker + Nginx (Recomendado)**

#### **Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript;
    }
}
```

#### **docker-compose.yml**
```yaml
version: '3.8'
services:
  abnp-frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_KEY}
    restart: unless-stopped
    
  # Opcional: Reverse proxy com SSL
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./ssl:/etc/nginx/certs
    restart: unless-stopped
```

### **Opção 2: Servidor VPS com PM2**

#### **Instalação**
```bash
# 1. Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar PM2
sudo npm install -g pm2

# 3. Clone e build do projeto
git clone <repo-url> abnp-platform
cd abnp-platform
npm install
npm run build

# 4. Servir com PM2 + serve
npm install -g serve
pm2 start "serve -s dist -l 3000" --name "abnp-frontend"
pm2 startup
pm2 save
```

#### **Nginx como Reverse Proxy**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **Opção 3: Vercel/Netlify (Mais Simples)**

#### **vercel.json**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

---

## 🔒 **CONFIGURAÇÃO DO SUPABASE**

### **1. Criação do Projeto Supabase**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar projeto
supabase init
supabase start
```

### **2. Configuração de Autenticação**
- **Email/Password:** Ativado por padrão
- **Magic Links:** Configurar SMTP
- **Google OAuth:** Configurar credenciais OAuth
- **Políticas de Senha:** Definir requisitos mínimos

### **3. Configuração RLS**
Todas as políticas já estão configuradas no código atual. Para aplicar:

```sql
-- Ativar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
```

### **4. Configuração de Storage (Futuro)**
```sql
-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Políticas para upload
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
```

---

## 📊 **MONITORAMENTO E LOGS**

### **1. Logs da Aplicação**
```bash
# PM2 logs
pm2 logs abnp-frontend

# Docker logs
docker logs container-name -f
```

### **2. Métricas do Supabase**
- Dashboard nativo do Supabase
- Logs de autenticação
- Logs do banco de dados
- Métricas de performance

### **3. Monitoramento Externo**
```bash
# Instalar ferramentas de monitoramento
sudo apt install htop iotop nethogs

# Configurar alertas (exemplo com Uptime Robot)
# - Monitor HTTP para verificar disponibilidade
# - Alertas por email/SMS em caso de downtime
```

---

## 🔧 **MANUTENÇÃO E OPERAÇÕES**

### **Scripts Úteis**

#### **backup-database.sh**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/abnp"
mkdir -p $BACKUP_DIR

# Backup via Supabase CLI
supabase db dump --db-url "$DATABASE_URL" > "$BACKUP_DIR/backup_$DATE.sql"

# Manter apenas backups dos últimos 30 dias
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete

echo "Backup created: backup_$DATE.sql"
```

#### **deploy.sh**
```bash
#!/bin/bash
PROJECT_DIR="/var/www/abnp-platform"
cd $PROJECT_DIR

echo "Starting deployment..."

# Backup atual
if [ -d "dist" ]; then
    cp -r dist dist.backup
    echo "Current build backed up"
fi

# Atualizar código
git pull origin main
npm install
npm run build

# Reiniciar serviços
pm2 reload abnp-frontend

# Verificar deploy
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Deploy successful!"
    rm -rf dist.backup
else
    echo "❌ Deploy failed! Rolling back..."
    rm -rf dist
    mv dist.backup dist
    pm2 reload abnp-frontend
    exit 1
fi
```

### **Tarefas de Manutenção Regulares**

#### **Diárias**
- [ ] Verificar logs de erro
- [ ] Monitorar uso de recursos (CPU, RAM, Disk)
- [ ] Backup automático do banco de dados
- [ ] Verificar status dos serviços

#### **Semanais**
- [ ] Atualizar dependências de segurança
- [ ] Revisar métricas de performance
- [ ] Limpeza de logs antigos
- [ ] Verificar certificados SSL

#### **Mensais**
- [ ] Atualização do sistema operacional
- [ ] Revisão de políticas de segurança
- [ ] Otimização do banco de dados
- [ ] Teste de recuperação de backup

---

## 🔒 **SEGURANÇA**

### **1. Configurações do Servidor**
```bash
# Firewall básico
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# Desabilitar login root
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl reload ssh

# Instalar fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### **2. SSL/TLS (Let's Encrypt)**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Auto-renovação
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **3. Validação de Inputs**
O projeto já implementa validação com **Zod** em todos os formulários:
```typescript
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000)
});
```

### **4. Autenticação e Autorização**
- **JWT tokens** gerenciados pelo Supabase
- **RLS policies** no banco de dados
- **Role-based access control** (admin/moderator/user)
- **Session management** com refresh tokens

---

## 🚨 **TROUBLESHOOTING**

### **Problemas Comuns**

#### **1. Erro de Build**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar versões Node.js
node --version  # Deve ser 16+
npm --version

# Build com logs detalhados
npm run build -- --verbose
```

#### **2. Erro de Conexão Supabase**
```typescript
// Verificar configuração no console do navegador
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

// Testar conexão
import { supabase } from '@/integrations/supabase/client';
supabase.from('profiles').select('count').then(console.log);
```

#### **3. Erro de Permissões RLS**
```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verificar role do usuário
SELECT * FROM user_roles WHERE user_id = auth.uid();
```

#### **4. Performance Issues**
- Verificar índices no banco de dados
- Otimizar queries React Query
- Implementar lazy loading de componentes
- Configurar cache no Nginx

#### **5. Problemas de Autenticação**
```typescript
// Debug auth state
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);

// Verificar session
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);
```

### **Logs Importantes**
```bash
# Logs do sistema
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f

# Logs da aplicação
tail -f /var/log/abnp/app.log

# Logs do PM2
pm2 logs abnp-frontend --lines 100
```

---

## 📈 **OTIMIZAÇÕES DE PERFORMANCE**

### **1. Frontend**
```typescript
// Lazy loading de rotas
import { lazy, Suspense } from 'react';
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Componente com Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>

// Otimização React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});
```

### **2. Banco de Dados**
```sql
-- Índices importantes
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_video_sessions_user ON video_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

-- Otimizar queries frequentes
ANALYZE; -- Atualizar estatísticas
```

### **3. Nginx Caching**
```nginx
# Cache para assets estáticos
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

---

## 🔄 **BACKUP E RECOVERY**

### **Estratégia de Backup**

#### **1. Backup do Banco (Diário)**
```bash
#!/bin/bash
# Script: backup-daily.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/abnp"
DATABASE_URL="postgresql://..."

mkdir -p $BACKUP_DIR

# Backup completo
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/full_backup_$DATE.sql.gz"

# Backup apenas dos dados
pg_dump --data-only "$DATABASE_URL" | gzip > "$BACKUP_DIR/data_backup_$DATE.sql.gz"

# Backup da estrutura
pg_dump --schema-only "$DATABASE_URL" | gzip > "$BACKUP_DIR/schema_backup_$DATE.sql.gz"

# Limpar backups antigos (manter 30 dias)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

#### **2. Backup de Assets (Semanal)**
```bash
#!/bin/bash
# Backup de uploads do Supabase Storage
# Via Supabase CLI ou API
supabase storage download --recursive avatars ./backups/storage/
```

#### **3. Backup do Código (Contínuo)**
```bash
# Git repository com tags de releases
git tag -a v$(date +%Y.%m.%d) -m "Production release $(date)"
git push origin --tags
```

### **Procedimento de Recovery**

#### **Recovery Total**
```bash
#!/bin/bash
# 1. Parar aplicação
pm2 stop abnp-frontend

# 2. Restaurar banco de dados
BACKUP_FILE="/backups/abnp/full_backup_20241127_120000.sql.gz"
gunzip -c $BACKUP_FILE | psql "$DATABASE_URL"

# 3. Restaurar aplicação
git checkout v2024.11.27
npm install
npm run build

# 4. Reiniciar serviços
pm2 start abnp-frontend

# 5. Verificar funcionamento
curl -f http://localhost:3000/health || echo "Recovery may have failed"
```

#### **Recovery Parcial (apenas dados)**
```bash
# Restaurar apenas dados (preservar estrutura atual)
gunzip -c /backups/abnp/data_backup_20241127.sql.gz | psql "$DATABASE_URL"
```

---

## 📞 **CONTATOS E SUPORTE**

### **Documentação Técnica**
- **React:** https://react.dev/
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev/
- **React Query:** https://tanstack.com/query/latest

### **Comunidades**
- **React Brasil:** [Telegram](https://t.me/reactbrasil)
- **Supabase Community:** [Discord](https://discord.supabase.com/)
- **Stack Overflow:** Para dúvidas específicas
- **GitHub Issues:** Para bugs e melhorias

### **Ferramentas de Monitoramento**
- **Uptime Robot:** Monitor de disponibilidade
- **Sentry:** Para tracking de erros em produção
- **Google Analytics:** Métricas de uso
- **Supabase Dashboard:** Métricas de backend

---

## ✅ **CHECKLIST DE DEPLOY**

### **Pré-Deploy**
- [ ] Código commitado e taggeado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado e testado
- [ ] SSL configurado e testado
- [ ] Backup realizado
- [ ] Testes de integração executados
- [ ] Build de produção gerado sem erros

### **Durante o Deploy**
- [ ] Aplicação parada graciosamente
- [ ] Novo build copiado para produção
- [ ] Serviços reiniciados
- [ ] Aplicação servindo corretamente
- [ ] Rotas funcionando (SPA routing)
- [ ] Autenticação funcionando
- [ ] Admin panel acessível
- [ ] APIs respondendo corretamente

### **Pós-Deploy**
- [ ] Monitoramento configurado e ativo
- [ ] Logs sendo coletados corretamente
- [ ] Métricas de performance dentro do esperado
- [ ] Backup agendado funcionando
- [ ] SSL renovação automática configurada
- [ ] Notificações de erro configuradas
- [ ] Testes de fumaça executados
- [ ] Equipe notificada sobre o deploy

### **Rollback (se necessário)**
- [ ] Backup da versão atual
- [ ] Restoration do backup anterior
- [ ] Verificação de integridade
- [ ] Notificação da equipe
- [ ] Análise de causa raiz
- [ ] Plano de correção documentado

---

## 🎯 **PRÓXIMOS PASSOS E MELHORIAS**

### **Curto Prazo (1-3 meses)**
- [ ] Implementar cache Redis para sessões
- [ ] Configurar CDN para assets estáticos
- [ ] Implementar health checks automáticos
- [ ] Configurar alertas de performance
- [ ] Otimizar queries do banco de dados

### **Médio Prazo (3-6 meses)**
- [ ] Implementar sistema de notificações push
- [ ] Criar dashboard de analytics interno
- [ ] Implementar sistema de logs centralizados
- [ ] Configurar ambiente de staging
- [ ] Implementar testes automatizados

### **Longo Prazo (6+ meses)**
- [ ] Migração para arquitetura de microserviços
- [ ] Implementar sistema de cache distribuído
- [ ] Configurar alta disponibilidade
- [ ] Implementar CI/CD completo
- [ ] Sistema de feature flags

---

Este manual fornece uma base sólida para operação autônoma do sistema ABNP. Qualquer técnico com conhecimento em React, Node.js e PostgreSQL conseguirá manter e expandir a plataforma usando esta documentação como referência completa.