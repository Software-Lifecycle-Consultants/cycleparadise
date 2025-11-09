---

description: "Task list for Sri Lanka Cycling Tour Website implementation"
---

# Tasks: Sri Lanka Cycling Tour Website

**Input**: Design documents from `/specs/001-cycling-tour-website/`
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅), quickstart.md (✅)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

**Web application structure**: Astro framework with `src/` for application code and `tests/` for testing

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Astro project structure with TypeScript configuration in root directory
- [ ] T002 Initialize package.json with Astro 4.0+, TypeScript 5.2+, TailwindCSS, and development dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript compiler options in project root
- [ ] T004 [P] Setup TailwindCSS configuration file with custom design tokens in tailwind.config.js
- [ ] T005 Create environment configuration files (.env.example, .env.local) with required variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup PostgreSQL database schema using Prisma in prisma/schema.prisma
- [ ] T007 [P] Create database migration files for all entities (TourPackage, Accommodation, Booking, etc.)
- [ ] T008 [P] Implement database connection utilities in src/lib/db/connection.ts
- [ ] T009 Create base Prisma client wrapper with error handling in src/lib/db/client.ts
- [ ] T010 [P] Setup Sharp image optimization service in src/lib/media/optimizer.ts
- [ ] T011 [P] Implement email service with NodeMailer in src/lib/email/service.ts
- [ ] T012 [P] Create authentication middleware for admin sessions in src/lib/auth/session.ts
- [ ] T013 [P] Setup base layout components in src/components/layout/
- [ ] T014 Setup Astro API routes structure in src/pages/api/
- [ ] T015 [P] Create error handling utilities and types in src/lib/errors/
- [ ] T016 [P] Implement logging service in src/lib/logging/
- [ ] T017 Configure Vitest testing framework in vitest.config.ts
- [ ] T018 [P] Setup Playwright e2e testing configuration in playwright.config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Discover and Browse Cycling Packages (Priority: P1) 🎯 MVP

**Goal**: Visitors can discover and browse cycling tour packages with rich media content and guides

**Independent Test**: Homepage loads with packages, package details accessible, cycling guides readable, mobile responsive

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create TourPackage model interface in src/types/models.ts
- [ ] T020 [P] [US1] Create CyclingGuide model interface in src/types/models.ts
- [ ] T021 [US1] Implement TourPackage repository with Prisma queries in src/lib/db/repositories/tour-packages.ts
- [ ] T022 [US1] Implement CyclingGuide repository with Prisma queries in src/lib/db/repositories/cycling-guides.ts
- [ ] T023 [P] [US1] Create PackageCard UI component in src/components/ui/PackageCard.astro
- [ ] T024 [P] [US1] Create PackageGallery UI component in src/components/media/PackageGallery.astro
- [ ] T025 [P] [US1] Create YouTubeEmbed component in src/components/media/YouTubeEmbed.astro
- [ ] T026 [P] [US1] Create InstagramFeed component in src/components/media/InstagramFeed.astro
- [ ] T027 [US1] Implement homepage layout in src/pages/index.astro with featured packages
- [ ] T028 [US1] Create package listing page in src/pages/packages/index.astro with filtering
- [ ] T029 [US1] Implement dynamic package detail pages in src/pages/packages/[slug].astro
- [ ] T030 [US1] Create cycling guides listing page in src/pages/guides/index.astro
- [ ] T031 [US1] Implement cycling guide detail pages in src/pages/guides/[slug].astro
- [ ] T032 [US1] Add search functionality component in src/components/forms/SearchForm.astro
- [ ] T033 [US1] Implement search API endpoint in src/pages/api/v1/search.ts
- [ ] T034 [US1] Create Instagram integration service in src/lib/integrations/instagram.ts
- [ ] T035 [US1] Setup SEO meta tags and structured data helpers in src/lib/seo/
- [ ] T036 [US1] Implement mobile navigation component in src/components/layout/MobileNav.astro

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Book Tours and Accommodation (Priority: P2)

**Goal**: Customers can select dates, choose accommodations, and submit booking requests with email confirmation

**Independent Test**: Package booking flow works from selection to confirmation email

### Implementation for User Story 2

- [ ] T037 [P] [US2] Create Booking model interface in src/types/models.ts
- [ ] T038 [P] [US2] Create Accommodation model interface in src/types/models.ts
- [ ] T039 [US2] Implement Booking repository with Prisma queries in src/lib/db/repositories/bookings.ts
- [ ] T040 [US2] Implement Accommodation repository in src/lib/db/repositories/accommodations.ts
- [ ] T041 [P] [US2] Create DatePicker calendar component in src/components/forms/DatePicker.astro
- [ ] T042 [P] [US2] Create AccommodationSelector component in src/components/forms/AccommodationSelector.astro
- [ ] T043 [P] [US2] Create BookingForm component in src/components/forms/BookingForm.astro
- [ ] T044 [US2] Implement booking validation logic in src/lib/validation/booking.ts
- [ ] T045 [US2] Create booking submission API endpoint in src/pages/api/v1/bookings.ts
- [ ] T046 [US2] Implement booking status check API in src/pages/api/v1/bookings/[bookingNumber]/status.ts
- [ ] T047 [US2] Create booking confirmation page in src/pages/booking/confirmation.astro
- [ ] T048 [US2] Create booking status page in src/pages/booking/status.astro
- [ ] T049 [US2] Implement email templates for booking notifications in src/lib/email/templates/
- [ ] T050 [US2] Add booking number generation utility in src/lib/utils/booking-number.ts
- [ ] T051 [US2] Implement 7-day advance booking validation in booking form and API
- [ ] T052 [US2] Create accommodation listing API endpoint in src/pages/api/v1/accommodations.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Admin Content Management (Priority: P3)

**Goal**: Administrators can securely log in and manage all website content through a dedicated backend interface

**Independent Test**: Admin can login, create/edit packages, manage accommodations, and confirm bookings

### Implementation for User Story 3

- [ ] T053 [P] [US3] Create AdminUser model interface in src/types/models.ts
- [ ] T054 [P] [US3] Create MediaAsset model interface in src/types/models.ts
- [ ] T055 [US3] Implement AdminUser repository with authentication in src/lib/db/repositories/admin-users.ts
- [ ] T056 [US3] Implement MediaAsset repository for file management in src/lib/db/repositories/media-assets.ts
- [ ] T057 [US3] Create admin authentication API endpoints in src/pages/api/v1/admin/auth/
- [ ] T058 [P] [US3] Create admin login page in src/pages/admin/login.astro
- [ ] T059 [P] [US3] Create admin dashboard layout in src/components/admin/AdminLayout.astro
- [ ] T060 [US3] Implement admin dashboard homepage in src/pages/admin/index.astro
- [ ] T061 [P] [US3] Create package management interface in src/pages/admin/packages/
- [ ] T062 [P] [US3] Create accommodation management interface in src/pages/admin/accommodations/
- [ ] T063 [P] [US3] Create booking management interface in src/pages/admin/bookings/
- [ ] T064 [US3] Implement file upload API endpoint in src/pages/api/v1/admin/media/upload.ts
- [ ] T065 [US3] Create image upload component in src/components/admin/ImageUpload.astro
- [ ] T066 [US3] Implement package CRUD API endpoints in src/pages/api/v1/admin/packages/
- [ ] T067 [US3] Implement accommodation CRUD API endpoints in src/pages/api/v1/admin/accommodations/
- [ ] T068 [US3] Implement booking confirmation API in src/pages/api/v1/admin/bookings/[id]/confirm.ts
- [ ] T069 [US3] Create rich text editor component for content in src/components/admin/RichTextEditor.astro
- [ ] T070 [US3] Add admin session middleware to protect admin routes
- [ ] T071 [US3] Implement password hashing utilities using bcrypt in src/lib/auth/password.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T072 [P] Create comprehensive error pages (404, 500) in src/pages/
- [ ] T073 [P] Implement sitemap.xml generation in src/pages/sitemap.xml.ts
- [ ] T074 [P] Create robots.txt in public/robots.txt
- [ ] T075 [P] Add WCAG 2.1 AA accessibility improvements across all components
- [ ] T076 [P] Implement progressive image loading and lazy loading strategies
- [ ] T077 [P] Add performance monitoring and analytics tracking
- [ ] T078 [P] Setup favicon and web app manifest in public/
- [ ] T079 [P] Implement breadcrumb navigation component
- [ ] T080 [P] Add social media meta tags (Open Graph, Twitter Cards)
- [ ] T081 Code cleanup and refactoring across all modules
- [ ] T082 Performance optimization: bundle analysis and optimization
- [ ] T083 Security hardening: input validation, XSS protection, CSRF tokens
- [ ] T084 [P] Database seeding with sample tour packages and accommodations
- [ ] T085 [P] Create development documentation in docs/
- [ ] T086 Run quickstart.md validation and end-to-end testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May reference US1 packages but is independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Manages content for US1/US2 but is independently testable

### Within Each User Story

- Models and types before repositories
- Repositories before API endpoints
- UI components can be built in parallel with backend
- API endpoints before pages that consume them
- Email templates before booking confirmation flow
- Authentication before admin interface components

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- UI components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all UI components for User Story 1 together:
Task: "Create PackageCard UI component in src/components/ui/PackageCard.astro"
Task: "Create PackageGallery UI component in src/components/media/PackageGallery.astro"
Task: "Create YouTubeEmbed component in src/components/media/YouTubeEmbed.astro"
Task: "Create InstagramFeed component in src/components/media/InstagramFeed.astro"

# Launch all model interfaces together:
Task: "Create TourPackage model interface in src/types/models.ts"
Task: "Create CyclingGuide model interface in src/types/models.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Package Discovery)
   - Developer B: User Story 2 (Booking System)
   - Developer C: User Story 3 (Admin Interface)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies within the same phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group completion
- Stop at any checkpoint to validate story independently
- File paths are specific to Astro framework structure
- All tasks follow TypeScript + Astro + Prisma architecture from plan.md