# Admin Panel Implementation Plan

## Phase 1: Foundation & Authentication (Priority: Critical)

### 1.1 Authentication System
**Estimated Time:** 2-3 hours

- [ ] Create login page (`/admin/login`)
  - Login form with email/password
  - Remember me checkbox
  - CSRF protection
  - Error handling
  
- [ ] Implement authentication middleware
  - Session validation
  - Route protection for `/admin/*` paths
  - Redirect logic
  
- [ ] Create logout functionality
  - Clear session
  - Redirect to login

- [ ] Create auth API endpoints
  - `POST /api/admin/auth/login`
  - `POST /api/admin/auth/logout`
  - `GET /api/admin/auth/session`

**Files to Create:**
- `src/pages/admin/login.astro`
- `src/middleware/admin-auth.ts`
- `src/pages/api/admin/auth/login.ts`
- `src/pages/api/admin/auth/logout.ts`
- `src/pages/api/admin/auth/session.ts`

**Dependencies:**
- Existing `src/lib/auth.ts`
- Existing `AdminUser` Prisma model

---

## Phase 2: Admin Layout & Dashboard (Priority: Critical)

### 2.1 Admin Layout Shell
**Estimated Time:** 2 hours

- [ ] Create admin layout component
  - Header with navigation
  - Sidebar (collapsible)
  - Main content area
  - Footer
  
- [ ] Implement responsive navigation
  - Desktop: sidebar + top nav
  - Mobile: hamburger menu
  
- [ ] Add user menu
  - Profile link
  - Logout button

**Files to Create:**
- `src/layouts/AdminLayout.astro`
- `src/components/admin/AdminHeader.astro`
- `src/components/admin/AdminSidebar.astro`
- `src/components/admin/UserMenu.astro`

### 2.2 Dashboard
**Estimated Time:** 3 hours

- [ ] Create dashboard page (`/admin`)
  - Metrics cards (bookings, revenue, packages, guides)
  - Recent bookings table
  - Quick actions section
  - Alerts/notifications
  
- [ ] Create dashboard API endpoint
  - Calculate metrics from database
  - Get recent bookings
  - Check for alerts

**Files to Create:**
- `src/pages/admin/index.astro`
- `src/pages/api/admin/dashboard/stats.ts`
- `src/components/admin/MetricCard.astro`
- `src/components/admin/RecentBookings.astro`

**Database Queries:**
- Count bookings by status
- Sum booking amounts by date range
- Count published packages/guides
- Get latest 5 bookings

---

## Phase 3: Tour Package Management (Priority: High)

### 3.1 Package List View
**Estimated Time:** 3 hours

- [ ] Create packages list page (`/admin/packages`)
  - Data table with columns
  - Search functionality
  - Filters (region, difficulty, published)
  - Pagination
  - Bulk actions
  
- [ ] Create packages list API
  - Fetch packages with filters
  - Support pagination
  - Support search

**Files to Create:**
- `src/pages/admin/packages/index.astro`
- `src/pages/api/admin/packages/index.ts`
- `src/components/admin/PackageTable.astro`
- `src/components/admin/SearchBar.astro`
- `src/components/admin/Pagination.astro`

### 3.2 Package Create/Edit Form
**Estimated Time:** 5 hours

- [ ] Create package form page (`/admin/packages/new`, `/admin/packages/[id]/edit`)
  - Basic information section
  - Pricing section
  - Description editors
  - Itinerary builder
  - Image upload
  - Additional details
  - SEO fields
  - FAQ builder
  
- [ ] Implement form validation
  - Client-side validation
  - Real-time feedback
  
- [ ] Create save/publish API endpoints
  - `POST /api/admin/packages` (create)
  - `PUT /api/admin/packages/[id]` (update)
  
- [ ] Implement image upload
  - Multi-image upload
  - Image optimization
  - Preview functionality

**Files to Create:**
- `src/pages/admin/packages/new.astro`
- `src/pages/admin/packages/[id]/edit.astro`
- `src/components/admin/PackageForm.astro`
- `src/components/admin/ItineraryBuilder.astro`
- `src/components/admin/ImageUploader.astro`
- `src/components/admin/FAQBuilder.astro`
- `src/pages/api/admin/packages/create.ts`
- `src/pages/api/admin/packages/[id]/update.ts`

### 3.3 Package Delete
**Estimated Time:** 1 hour

- [ ] Implement delete functionality
  - Confirmation modal
  - Delete API endpoint
  - Remove associated images
  
**Files to Create:**
- `src/components/admin/ConfirmModal.astro`
- `src/pages/api/admin/packages/[id]/delete.ts`

---

## Phase 4: Cycling Guide Management (Priority: High)

### 4.1 Guide List View
**Estimated Time:** 2 hours

- [ ] Create guides list page (`/admin/guides`)
  - Similar to packages list
  - Table with guide-specific columns
  - Search and filters
  
**Files to Create:**
- `src/pages/admin/guides/index.astro`
- `src/pages/api/admin/guides/index.ts`
- `src/components/admin/GuideTable.astro`

### 4.2 Guide Create/Edit Form
**Estimated Time:** 4 hours

- [ ] Create guide form page
  - Basic information
  - Route information
  - Route segments builder
  - Practical information
  - Media upload (images, GPX, videos)
  - SEO fields
  
- [ ] Create save API endpoints
  - `POST /api/admin/guides` (create)
  - `PUT /api/admin/guides/[id]` (update)

**Files to Create:**
- `src/pages/admin/guides/new.astro`
- `src/pages/admin/guides/[id]/edit.astro`
- `src/components/admin/GuideForm.astro`
- `src/components/admin/RouteSegmentBuilder.astro`
- `src/pages/api/admin/guides/create.ts`
- `src/pages/api/admin/guides/[id]/update.ts`

---

## Phase 5: Booking Management (Priority: High)

### 5.1 Booking List View
**Estimated Time:** 3 hours

- [ ] Create bookings list page (`/admin/bookings`)
  - Table with booking details
  - Status badges
  - Search by customer/booking ID
  - Filters (status, package, date range)
  - Sort options
  - Export to CSV
  
**Files to Create:**
- `src/pages/admin/bookings/index.astro`
- `src/pages/api/admin/bookings/index.ts`
- `src/components/admin/BookingTable.astro`
- `src/components/admin/StatusBadge.astro`

### 5.2 Booking Detail View
**Estimated Time:** 3 hours

- [ ] Create booking detail page (`/admin/bookings/[id]`)
  - Customer information
  - Tour details
  - Pricing breakdown
  - Status history
  - Actions (update status, send email)
  
- [ ] Implement status update
  - Dropdown to change status
  - Save to database
  - Send notification email
  
- [ ] Implement email functionality
  - Email templates
  - Send confirmation/cancellation emails
  - Custom message composer

**Files to Create:**
- `src/pages/admin/bookings/[id]/index.astro`
- `src/pages/api/admin/bookings/[id]/update.ts`
- `src/pages/api/admin/bookings/[id]/email.ts`
- `src/components/admin/BookingDetail.astro`
- `src/components/admin/EmailComposer.astro`
- `src/lib/email-templates/admin/*.ts`

### 5.3 Booking Export
**Estimated Time:** 1 hour

- [ ] Implement CSV export
  - Export filtered bookings
  - Include all relevant fields
  
**Files to Create:**
- `src/pages/api/admin/bookings/export.ts`

---

## Phase 6: Image Management (Priority: Medium)

### 6.1 Media Library
**Estimated Time:** 3 hours

- [ ] Create media library page (`/admin/media`)
  - Grid view of images
  - Upload multiple images
  - Search by filename
  - Filter by usage
  - Bulk delete
  
- [ ] Implement image upload system
  - Drag-and-drop support
  - Multiple file selection
  - Progress indicators
  - Image optimization
  - Thumbnail generation

**Files to Create:**
- `src/pages/admin/media/index.astro`
- `src/pages/api/admin/media/upload.ts`
- `src/pages/api/admin/media/index.ts`
- `src/components/admin/MediaGrid.astro`
- `src/components/admin/ImageUploadZone.astro`
- `src/lib/image-utils.ts`

### 6.2 Image Detail View
**Estimated Time:** 1 hour

- [ ] Create image detail modal/page
  - Large preview
  - Edit alt text
  - See usage
  - Copy URL
  - Delete option

**Files to Create:**
- `src/components/admin/ImageDetailModal.astro`
- `src/pages/api/admin/media/[id]/update.ts`
- `src/pages/api/admin/media/[id]/delete.ts`

---

## Phase 7: Admin User Management (Priority: Low)

### 7.1 User List View
**Estimated Time:** 2 hours

- [ ] Create users list page (`/admin/users`)
  - Table of admin users
  - Add new user button
  - Edit/Delete actions
  
**Files to Create:**
- `src/pages/admin/users/index.astro`
- `src/pages/api/admin/users/index.ts`
- `src/components/admin/UserTable.astro`

### 7.2 User Create/Edit
**Estimated Time:** 2 hours

- [ ] Create user form page
  - Username, email, password fields
  - Validation
  - Password strength indicator
  
- [ ] Create user APIs
  - `POST /api/admin/users` (create)
  - `PUT /api/admin/users/[id]` (update)
  - `DELETE /api/admin/users/[id]` (delete)

**Files to Create:**
- `src/pages/admin/users/new.astro`
- `src/pages/admin/users/[id]/edit.astro`
- `src/components/admin/UserForm.astro`
- `src/pages/api/admin/users/create.ts`
- `src/pages/api/admin/users/[id]/update.ts`
- `src/pages/api/admin/users/[id]/delete.ts`

---

## Phase 8: Polish & Enhancement (Priority: Low)

### 8.1 Notifications & Alerts
**Estimated Time:** 2 hours

- [ ] Implement toast notifications
  - Success messages
  - Error messages
  - Info messages
  
- [ ] Add dashboard alerts
  - Pending bookings alert
  - System notifications

**Files to Create:**
- `src/components/admin/Toast.astro`
- `src/lib/notification-utils.ts`

### 8.2 Loading States
**Estimated Time:** 1 hour

- [ ] Add loading spinners
  - Form submissions
  - Data fetching
  - Image uploads
  
**Files to Create:**
- `src/components/admin/Spinner.astro`
- `src/components/admin/LoadingOverlay.astro`

### 8.3 Error Handling
**Estimated Time:** 2 hours

- [ ] Create error pages
  - 404 for admin routes
  - 500 error page
  
- [ ] Improve error messages
  - User-friendly messages
  - Detailed logging

**Files to Create:**
- `src/pages/admin/404.astro`
- `src/pages/admin/500.astro`

---

## Development Order (Recommended)

### Sprint 1 (Week 1)
1. Authentication System (Phase 1)
2. Admin Layout Shell (Phase 2.1)
3. Dashboard (Phase 2.2)

**Deliverable:** Working admin panel with login and basic dashboard

### Sprint 2 (Week 2)
4. Package List View (Phase 3.1)
5. Package Create/Edit Form (Phase 3.2)
6. Package Delete (Phase 3.3)

**Deliverable:** Full tour package management

### Sprint 3 (Week 3)
7. Guide List View (Phase 4.1)
8. Guide Create/Edit Form (Phase 4.2)
9. Booking List View (Phase 5.1)

**Deliverable:** Guide management + booking overview

### Sprint 4 (Week 4)
10. Booking Detail View (Phase 5.2)
11. Booking Export (Phase 5.3)
12. Media Library (Phase 6.1)

**Deliverable:** Complete booking management + media library

### Sprint 5 (Week 5 - Optional)
13. Image Detail View (Phase 6.2)
14. User Management (Phase 7)
15. Polish & Enhancement (Phase 8)

**Deliverable:** Complete admin panel with all features

---

## Testing Checklist

### Functionality Testing
- [ ] Login/logout works correctly
- [ ] Session persistence (remember me)
- [ ] Session timeout
- [ ] Create package saves to database
- [ ] Edit package updates correctly
- [ ] Delete package removes from database
- [ ] Image upload works and optimizes images
- [ ] Booking status updates correctly
- [ ] Email notifications send
- [ ] Search and filters work
- [ ] Pagination works
- [ ] Bulk actions work
- [ ] Form validation catches errors
- [ ] CSV export contains correct data

### Security Testing
- [ ] Unauthenticated users redirected to login
- [ ] CSRF protection active
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] Rate limiting works on login
- [ ] Sessions expire correctly
- [ ] Passwords hashed in database
- [ ] Sensitive data not in logs

### Performance Testing
- [ ] Dashboard loads in < 2s
- [ ] Package list loads quickly (< 1s)
- [ ] Image upload completes in < 5s per image
- [ ] Search responds quickly (< 500ms)
- [ ] No memory leaks on long sessions

### Responsive Testing
- [ ] Mobile layout works (< 640px)
- [ ] Tablet layout works (640-1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Navigation collapses on mobile
- [ ] Tables adapt to card view on mobile
- [ ] Forms stack vertically on mobile

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome)

---

## Dependencies & Prerequisites

### Existing Code to Use
- ✅ `src/lib/auth.ts` - Authentication utilities
- ✅ `src/lib/db/repositories/tour-package.repository.ts` - Package CRUD
- ✅ `src/lib/db/repositories/cycling-guide.repository.ts` - Guide CRUD
- ✅ `src/lib/db/connection.ts` - Database connection
- ✅ `prisma/schema.prisma` - Database schema
- ✅ Existing AdminUser, TourPackage, CyclingGuide models

### New Dependencies to Install
```bash
# None required - use existing libraries
# (Astro, Prisma, bcrypt, nodemailer already installed)
```

### Environment Variables Needed
```bash
# Already in .env.example
DATABASE_URL="postgresql://cycleparadise:cycleparadise_dev@localhost:5432/cycleparadise"
SESSION_SECRET="your-super-secret-session-key"
ADMIN_EMAIL="admin@cycleparadise.lk"
```

---

## Estimated Total Time

| Phase | Time Estimate |
|-------|--------------|
| Phase 1: Authentication | 3 hours |
| Phase 2: Layout & Dashboard | 5 hours |
| Phase 3: Package Management | 9 hours |
| Phase 4: Guide Management | 6 hours |
| Phase 5: Booking Management | 7 hours |
| Phase 6: Image Management | 4 hours |
| Phase 7: User Management | 4 hours |
| Phase 8: Polish & Enhancement | 5 hours |
| **Total** | **43 hours** |

**MVP (Phases 1-5):** ~30 hours
**Full Version:** ~43 hours

---

## Next Steps

1. Review spec and plan with team
2. Set up development environment (Docker database)
3. Create first admin user in database
4. Start with Phase 1 (Authentication)
5. Build iteratively, testing each phase
6. Deploy to staging for testing
7. Collect feedback and iterate
8. Deploy to production
