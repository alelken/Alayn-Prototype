# Alayn Mental Health Platform

## Overview

Alayn is a comprehensive mental health platform designed to bridge the mental health gap, particularly in regions with limited access to mental health services. The application provides AI-powered personality analysis, therapy booking, mindfulness exercises, educational content, and workshops. The platform follows a mobile-first approach with a clean, animated, and simplistic design philosophy using a peacock blue color scheme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First**: Responsive design optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Middleware**: Custom logging and error handling
- **Development**: Hot reload with Vite integration

### Database & ORM
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless connection
- **Schema**: Shared schema definitions between client and server

## Key Components

### Core Features
1. **Personality Analysis**: AI-powered psychological assessment using questionnaires
2. **Therapy Booking**: Therapist search, filtering, and session scheduling
3. **Mindfulness Exercises**: Breathing, yoga, meditation, and sleep exercises
4. **Media Library**: Educational videos, audio content, and articles
5. **Workshops**: Group sessions and community events
6. **User Progress**: Streak tracking and achievement system

### Database Schema
- **Users**: Profile management with subscription tiers
- **Personality Analysis**: AI-powered assessment results and scoring
- **Therapists**: Professional profiles with specialties and ratings
- **Bookings**: Session scheduling and management
- **Exercises**: Mindfulness and wellness activities
- **Media Content**: Educational resources with premium content
- **Workshops**: Group sessions and events
- **User Progress**: Activity tracking and streak management

### UI/UX Components
- **Design System**: Consistent component library using Radix UI
- **Theming**: CSS variables for consistent color scheme
- **Animations**: Subtle transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Mobile-first approach with touch targets

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints for all data operations
2. **Query Management**: TanStack Query for caching and synchronization
3. **Error Handling**: Global error boundaries and toast notifications
4. **Loading States**: Consistent loading indicators across components

### State Management
- **Server State**: TanStack Query for API data
- **Local State**: React hooks for component-level state
- **Persistent State**: localStorage for user preferences
- **Form State**: React Hook Form for form management

### Authentication Flow
- **Multi-method Auth**: Email/phone, Google, and Apple sign-in
- **Session Management**: Cookie-based sessions with secure handling
- **User Context**: Global user state management
- **Protected Routes**: Authentication guards for secure pages

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **wouter**: Lightweight routing library
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **drizzle-kit**: Database migration and schema management
- **@replit/vite-plugin-***: Replit-specific development tools

### UI/UX Libraries
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility
- **lucide-react**: Icon library
- **react-hook-form**: Form management
- **date-fns**: Date manipulation utilities

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command
4. **Assets**: Static assets served from public directory

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **REPL_ID**: Replit-specific environment detection

### Production Deployment
- **Server**: Express.js serves both API and static files
- **Database**: Neon Database for serverless PostgreSQL
- **Static Assets**: Served directly by Express in production
- **PWA Support**: Service worker and manifest for offline capability

### Development Workflow
- **Hot Reload**: Vite HMR for frontend changes
- **API Proxy**: Vite dev server proxies API requests
- **Database Sync**: Drizzle schema synchronization
- **TypeScript**: Strict type checking across the stack