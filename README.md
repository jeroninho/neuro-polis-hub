# 🧠 ABNP - Academia Brasileira de Neurociência Política

Uma plataforma educacional moderna e responsiva para a Academia Brasileira de Neurociência Política, oferecendo acesso gratuito a conteúdos sobre neurociência aplicada à política.

## ✨ Características

### 🎯 **Funcionalidades Principais**
- **Landing Page Atrativa**: Design acadêmico profissional com formulários de login/cadastro
- **Dashboard Interativo**: Painel completo do aluno com navegação intuitiva
- **Cursos Gratuitos**: Acesso a vídeos educacionais curados
- **Blog Integration**: RSS feed do site oficial da ABNP
- **Ofertas Especiais**: Promoções exclusivas do Método NeuroCP
- **Perfil do Usuário**: Gerenciamento de dados e acompanhamento de progresso

### 🎨 **Design System**
- **Cores Acadêmicas**: Paleta profissional com azul, roxo e detalhes dourados
- **Tipografia Elegante**: Inter + Playfair Display para máxima legibilidade
- **Animações Suaves**: Micro-interações que elevam a experiência
- **Responsivo**: Design adaptativo para todos os dispositivos
- **Acessibilidade**: Implementação de boas práticas de UX

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Navegue para o diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

## 🛠️ Stack Técnica

### Frontend
- **React 18** - Interface moderna e reativa
- **TypeScript** - Tipagem estática para maior robustez
- **Tailwind CSS** - Sistema de design consistente e escalável
- **shadcn/ui** - Componentes de alta qualidade
- **Lucide React** - Ícones vetoriais elegantes
- **Vite** - Build tool rápido e moderno

### Integrações Planejadas
- **Supabase** - Backend completo (auth, database, storage)
- **YouTube API** - Integração com playlists educacionais  
- **RSS Feeds** - Consumo automático do blog oficial
- **Hotmart** - Links para cursos premium

## 🔧 Configuração Futura

### Variáveis de Ambiente
Quando conectado ao Supabase, configure:

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_key

# Integrações Externas
YOUTUBE_PLAYLIST_ID=PLxxxx
BLOG_RSS_URL=https://academiadaneuropolitica.com.br/feed/
HOTMART_COURSE_URL=https://hotmart.com/pt-br/marketplace/produtos/metodo-neurocp
HOTMART_COUPON_CODE=ABNP10
```

## 📱 Funcionalidades por Seção

### 🏠 **Landing Page**
- Hero section com call-to-action
- Formulários de login/cadastro com validação
- Apresentação dos benefícios da plataforma
- Design gradient atrativo

### 📊 **Dashboard**
- Visão geral do progresso do aluno
- Últimos vídeos e artigos em destaque
- Ofertas especiais personalizadas
- Navegação lateral intuitiva

### 🎓 **Cursos Gratuitos**
- Player de vídeos integrado
- Lista organizada de conteúdos
- Acompanhamento de progresso
- Call-to-action para curso premium

### 📰 **Blog**
- Feed automático via RSS
- Layout limpo e legível
- Links para artigos completos
- Sistema de busca (futuro)

### 💰 **Ofertas**
- Destaque para o Método NeuroCP
- Sistema de cupons de desconto
- Preços dinâmicos
- Integração com Hotmart

### 👤 **Perfil**
- Edição de dados pessoais
- Histórico de aprendizado
- Configurações de notificação
- Estatísticas de uso

## 🔒 Segurança

- Validação client-side e server-side
- Sanitização de inputs
- Autenticação segura via Supabase
- Proteção contra XSS e CSRF

## 🚀 Deploy

### Lovable (Recomendado)
1. Acesse [Lovable](https://lovable.dev)
2. Clique em "Share" → "Publish"
3. Configure domínio personalizado se necessário

### Alternativas
- **Vercel**: Deploy automático via GitHub
- **Netlify**: Integração contínua
- **VPS**: Docker + Caddy (conforme especificado)

## 📈 Roadmap Futuro

- [ ] **Integração Supabase** - Auth e database
- [ ] **YouTube Player** - Reprodução de playlists
- [ ] **RSS Reader** - Consumo automático do blog  
- [ ] **Sistema de Notificações** - E-mail e push
- [ ] **Gamificação** - Badges e conquistas
- [ ] **Comentários** - Interação entre alunos
- [ ] **Certificados** - Geração automática
- [ ] **Mobile App** - PWA ou React Native

## 🤝 Contribuição

Este projeto foi desenvolvido especificamente para a ABNP. Para sugestões ou melhorias, entre em contato através dos canais oficiais da academia.

## 📄 Licença

Todos os direitos reservados à Academia Brasileira de Neurociência Política.

---

**Desenvolvido com ❤️ para transformar a educação em neurociência política no Brasil**