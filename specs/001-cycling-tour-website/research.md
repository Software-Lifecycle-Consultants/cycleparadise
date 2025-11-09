# Technical Research: Sri Lanka Cycling Tour Website

**Created**: 2024-11-08  
**Branch**: 001-cycling-tour-website  
**Phase**: 0 - Research & Analysis

## Research Tasks Completed

### 1. Astro Framework for Tourism Websites

**Decision**: Astro 4.0+ with TypeScript and islands architecture

**Rationale**: 
- Astro's static site generation provides excellent SEO performance (meets PageSpeed >90 requirement)
- Islands architecture allows selective hydration for interactive components (booking forms, admin panels)
- Built-in image optimization with Sharp integration supports rich media requirements
- File-based routing simplifies content management structure
- Native support for multiple UI frameworks (React, Vue) for component flexibility

**Alternatives considered**:
- Next.js: More complex for primarily static content, overkill for the use case
- Nuxt.js: Similar benefits but Vue-centric, while project may need React components
- SvelteKit: Smaller ecosystem, less suitable for content-heavy tourism site

### 2. Database Architecture for Booking System

**Decision**: PostgreSQL with Prisma ORM

**Rationale**:
- PostgreSQL provides ACID compliance for booking data integrity
- JSON fields support flexible content structure (multilingual content, package variations)
- Prisma offers type-safe database access aligning with TypeScript approach
- Excellent performance for read-heavy tourism content with occasional booking writes
- Supports both development (local) and production (hosted) environments

**Alternatives considered**:
- MySQL: Less advanced JSON support, fewer modern features
- SQLite: Insufficient for multi-user booking concurrent access
- MongoDB: Unnecessary complexity for structured tourism data

### 3. Image and Media Management

**Decision**: File system storage with Sharp optimization and CDN distribution

**Rationale**:
- Sharp integration with Astro provides automatic image optimization and responsive sizing
- File system approach keeps media assets close to application for development simplicity
- CDN overlay (Cloudflare/AWS CloudFront) can be added later for production scaling
- Supports admin upload requirements with local file management

**Alternatives considered**:
- Cloudinary: Additional cost and complexity for MVP phase
- AWS S3: Overkill for initial deployment, can migrate later
- Database BLOB storage: Poor performance for large media files

### 4. Authentication Strategy for Admin Panel

**Decision**: Session-based authentication with bcrypt password hashing

**Rationale**:
- Simple email/password approach aligns with clarified requirements
- Session cookies provide secure, stateless authentication
- bcrypt provides industry-standard password security
- No external dependencies or OAuth complexity needed for single admin use

**Alternatives considered**:
- JWT tokens: Unnecessary complexity for server-side rendered admin panel
- OAuth/SSO: Overengineered for small business single-admin scenario
- Basic HTTP auth: Insufficient security for production admin interface

### 5. Email Notification System

**Decision**: NodeMailer with SMTP provider (SendGrid/Mailgun)

**Rationale**:
- NodeMailer provides reliable email delivery with template support
- SMTP providers offer better deliverability than local mail servers
- Cost-effective for booking confirmation volume (estimated <100/month initially)
- Template-based approach supports future multilingual email requirements

**Alternatives considered**:
- AWS SES: More complex setup, better for high-volume applications
- Local SMTP: Poor deliverability, likely to be marked as spam
- Third-party email APIs: Additional vendor dependency without significant benefits

### 6. Instagram Integration Approach

**Decision**: Instagram Basic Display API with hashtag-based content retrieval

**Rationale**:
- Instagram Basic Display API supports hashtag queries without business verification
- Cached approach (refresh every hour) prevents API rate limiting
- Fallback to static content ensures site functionality if API unavailable
- Aligns with simplified "display recent posts via hashtag" requirement

**Alternatives considered**:
- Instagram Graph API: Requires business verification, more complex setup
- Third-party aggregation services: Additional cost and dependency
- Manual content curation: Defeats purpose of social media integration

### 7. Performance Optimization Strategy

**Decision**: Astro static generation + API routes for dynamic content + image optimization

**Rationale**:
- Static generation for all content pages achieves <2 second load time requirement
- API routes handle dynamic booking and admin operations
- Astro's built-in image optimization meets performance criteria
- Lazy loading and progressive enhancement support mobile performance goals

**Alternatives considered**:
- Full SPA approach: Slower initial load, poor SEO performance
- Traditional server-side rendering: More complex caching requirements
- Headless CMS: Additional complexity without clear benefits for this use case

## Technical Decisions Summary

| Component | Technology | Justification |
|-----------|------------|---------------|
| Frontend Framework | Astro 4.0+ with TypeScript | SEO performance, static generation, islands architecture |
| Database | PostgreSQL with Prisma ORM | Data integrity, JSON support, type safety |
| Authentication | Session-based with bcrypt | Simple, secure, aligns with requirements |
| Image Processing | Sharp with file system storage | Built-in Astro integration, performance optimization |
| Email Service | NodeMailer with SMTP provider | Reliable delivery, template support |
| Social Integration | Instagram Basic Display API | Hashtag-based content, cached retrieval |
| Testing Strategy | Vitest + Playwright + Lighthouse | Unit, e2e, and performance testing coverage |
| Styling Framework | TailwindCSS | Component consistency, responsive design |

## Implementation Risks and Mitigations

1. **Instagram API Rate Limits**: Mitigate with hourly caching and fallback content
2. **Image Upload Size**: Implement client-side compression and server-side validation
3. **Email Deliverability**: Use established SMTP provider with proper DNS configuration
4. **Database Concurrency**: PostgreSQL handles booking conflicts, admin notifications for edge cases
5. **Performance on Mobile**: Progressive enhancement and lazy loading strategies

## Phase 0 Complete

All technical unknowns resolved. Ready to proceed to Phase 1: Design & Contracts.