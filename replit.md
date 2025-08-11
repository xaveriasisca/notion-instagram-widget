# Replit.md

## Overview

This is a full-stack web application that connects Instagram content to Notion databases through embeddable widgets. The system allows users to create Instagram grid widgets that sync with their Notion content calendar databases. Built with a modern React frontend using shadcn/ui components, Express.js backend, and Drizzle ORM for database management.

## User Preferences

Preferred communication style: Simple, everyday language.
- Brand preference: "xav agency widgets" instead of "Grace & Grow"
- Widget display: No title display on embedded widgets (clean Instagram-style grid only)
- Deployment preference: GitHub + Vercel + Neon Database (free services, no Replit dependency)
- Integration requirement: Notion integration toggle must work in production

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **External API**: Notion API client for database integration
- **Development**: Hot reload with tsx and Vite middleware integration

### Key Design Decisions
- **Monorepo Structure**: Shared types and schemas between client and server in `/shared` directory
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Modern CSS**: CSS custom properties for dynamic theming support
- **Component Architecture**: Composition-based UI components with consistent naming conventions

## Key Components

### Database Schema (`shared/schema.ts`)
- **Users Table**: Basic user authentication with username/password
- **Widgets Table**: Widget configurations with Notion integration settings
- **Validation**: Zod schemas for runtime type checking and form validation

### Core Pages
- **Home** (`/`): Dashboard showing existing widgets with management capabilities
- **Setup** (`/setup`): Multi-step widget configuration with Notion integration
- **404**: Error handling for undefined routes

### Backend Services
- **Notion Integration** (`server/notion.ts`): Token validation and database schema retrieval
- **Storage Layer** (`server/storage.ts`): Abstracted data access with in-memory implementation
- **API Routes** (`server/routes.ts`): RESTful endpoints for widget and validation operations

## Data Flow

1. **Widget Creation**: User provides Notion token and database URL through setup form
2. **Validation Pipeline**: Backend validates Notion credentials and database accessibility
3. **Configuration Storage**: Widget settings stored in PostgreSQL with unique access tokens
4. **Content Sync**: Widgets fetch Instagram-style grid data from configured Notion databases
5. **Real-time Updates**: TanStack Query manages client-side cache invalidation and refetching

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Backend**: Express.js, Drizzle ORM, Neon Database serverless driver

### External Services
- **Notion API**: Content management and database operations
- **Neon Database**: Serverless PostgreSQL hosting
- **Vercel Hosting**: Production deployment platform
- **GitHub Integration**: Code repository and CI/CD

### Development Tools
- **Build**: Vite, esbuild for server bundling
- **TypeScript**: Strict type checking with path mapping
- **Database**: Drizzle Kit for schema migrations

## Deployment Strategy

### Development Environment (Replit)
- **Frontend**: Vite dev server with HMR and error overlay
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Drizzle push for schema synchronization

### Production Deployment (Vercel + GitHub + Neon)
- **Hosting**: Vercel serverless functions and static hosting
- **Frontend**: Vite build output to `dist/public`
- **Backend**: Serverless functions in `/api` directory
- **Database**: Neon PostgreSQL with connection pooling
- **CI/CD**: GitHub integration with automatic deployments

### Database Management
- **Production DB**: Neon PostgreSQL (serverless, auto-scaling)
- **Schema**: Single source of truth in `shared/schema.ts`
- **Connection**: Environment-based DATABASE_URL configuration
- **Auto-setup**: Tables created automatically on first use

### API Architecture
- **Token Validation**: `/api/validate-token` - Real Notion API validation
- **Database Validation**: `/api/validate-database` - Live database access testing
- **Widget Management**: `/api/widgets` - CRUD operations for widget configurations
- **Widget Serving**: `/api/widget/[token]` - Public widget data endpoints
- **CORS Enabled**: All endpoints support cross-origin embedding

The application uses a clean separation between client and server code while sharing type definitions and validation schemas. The architecture supports both development and production deployments with optimized build processes and proper error handling throughout the stack.