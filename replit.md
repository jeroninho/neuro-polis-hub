# ABNP Platform - Academia Brasileira de Neurociência Política

## Overview

The ABNP Platform is an educational web application built for the Brazilian Academy of Political Neuroscience. It provides free access to educational content including video courses, articles from the ABNP blog, and special offers for the NeuroCP Method. The platform features a modern React-based frontend with user authentication, video progress tracking, and a comprehensive admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **Framework:** React 18 with TypeScript for type safety
- **Build Tool:** Vite for fast development and optimized production builds
- **Routing:** React Router DOM v6 for client-side navigation
- **State Management:** TanStack React Query v5 for server state and caching

**UI/Design System:**
- **Styling:** Tailwind CSS with custom HSL-based design tokens
- **Component Library:** shadcn/ui (Radix UI primitives) for accessible, unstyled components
- **Design Theme:** Academic color palette with primary blue (#3B82F6), secondary purple, and gold accents
- **Typography:** Inter for body text, Playfair Display for headings
- **Icons:** Lucide React for consistent iconography

**Key Design Decisions:**
- HSL color system for better theming flexibility and dark mode support (foundation laid but not fully implemented)
- Component-based architecture with reusable UI primitives from shadcn/ui
- Responsive design with mobile-first approach using Tailwind breakpoints
- Form validation using Zod schemas for type-safe input validation

### Backend Architecture

**Primary Backend:** Supabase (Backend-as-a-Service)
- **Authentication:** Supabase Auth for user management, password reset flows
- **Database:** PostgreSQL (via Supabase) for all persistent data
- **Real-time:** Supabase real-time subscriptions available but not heavily utilized
- **Storage:** Supabase Storage for media assets (configured but primary usage is YouTube embeds)

**Data Layer Design:**
- Custom React hooks (`useSupabaseData.ts`) abstract Supabase client interactions
- Type-safe data models defined in TypeScript interfaces
- React Query for automatic caching, background refetching, and optimistic updates

**Authentication Flow:**
- Email/password authentication with display name collection on signup
- Protected routes using `AuthContext` and `useAuth` hook
- Role-based access control (admin/moderator/user) via `user_roles` table
- Password reset with email verification flow

### Data Storage

**Database Schema (PostgreSQL via Supabase):**

Key tables include:
- `courses` - Video course content with YouTube URLs, metadata, ordering
- `articles` - Blog articles with external URL support for RSS integration
- `user_profiles` - Extended user data (display_name, email_notifications)
- `user_roles` - Role assignments (admin, moderator, user)
- `user_progress` - Course completion tracking per user
- `video_sessions` - Granular video watch time and progress tracking
- `special_offers` - Marketing offers display
- `email_campaigns` - Email marketing management

**Data Access Patterns:**
- Read-heavy operations use React Query caching with configurable stale times
- Write operations trigger automatic cache invalidation
- Video progress auto-saves every 5 seconds during playback
- Optimistic UI updates for better perceived performance

### External Dependencies

**Third-Party Services:**
- **Supabase:** Authentication, PostgreSQL database, storage (primary backend infrastructure)
- **YouTube:** Video hosting and embedded player (via YouTube IFrame API)
- **ABNP Blog:** RSS feed integration for articles (external URL: academiadaneuropolitica.com.br)

**Key Libraries:**
- **@supabase/supabase-js:** Supabase client SDK for all backend interactions
- **@tanstack/react-query:** Server state management, caching, and synchronization
- **react-hook-form + @hookform/resolvers:** Form state management with Zod validation
- **zod:** Runtime type validation for forms and API responses
- **date-fns:** Date formatting and manipulation
- **embla-carousel-react:** Carousel implementation for content browsing

**Media Handling:**
- YouTube videos embedded via iframe with custom progress tracking
- YouTube IFrame API dynamically loaded for player control
- Video IDs extracted from various YouTube URL formats using regex patterns
- Thumbnail images from Supabase Storage or YouTube default thumbnails

**Admin Features:**
- Comprehensive admin panel at `/admin` route
- User management, content CRUD operations
- Email campaign management
- Role-based access control enforced at component level
- Sidebar navigation using shadcn/ui Sidebar component

**Development Tools:**
- **ESLint + TypeScript ESLint:** Code quality and type checking
- **Vite SWC Plugin:** Fast React compilation
- **PostCSS + Autoprefixer:** CSS processing for Tailwind
- **Lovable Tagger:** Development-only component identification (disabled in production)