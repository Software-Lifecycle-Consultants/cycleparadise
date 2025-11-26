# Admin Panel - Development Tasks

## 🎯 Sprint 1: Foundation (Days 1-2)

### Day 1: Authentication & Layout

#### Task 1.1: Authentication System ⏱️ 3 hours
- [ ] Create login page UI (`src/pages/admin/login.astro`)
  - Email/password form
  - Remember me checkbox
  - Error message display
  - CSRF token
  - Tailwind styling
  
- [ ] Create auth API endpoints
  - [ ] `POST /api/admin/auth/login.ts`
    - Validate credentials against AdminUser table
    - Create session cookie
    - Return success/error
  - [ ] `POST /api/admin/auth/logout.ts`
    - Clear session
    - Redirect to login
  - [ ] `GET /api/admin/auth/session.ts`
    - Check if session valid
    - Return user data if authenticated

- [ ] Create authentication middleware
  - [ ] `src/middleware/admin-auth.ts`
    - Check session on all `/admin/*` routes
    - Exclude `/admin/login` from check
    - Redirect to login if unauthenticated
    - Set user in locals for access in pages

**Acceptance Criteria:**
- Admin can log in with valid credentials
- Invalid credentials show error message
- Session persists across page refreshes
- Unauthenticated users redirect to login
- Authenticated users can't access login page (redirect to dashboard)

#### Task 1.2: Admin Layout Shell ⏱️ 2 hours
- [ ] Create admin layout (`src/layouts/AdminLayout.astro`)
  - Responsive header with navigation
  - Collapsible sidebar
  - Main content area
  - Footer
  
- [ ] Create header component (`src/components/admin/AdminHeader.astro`)
  - Logo
  - Main navigation links
  - User menu dropdown
  - Mobile hamburger menu
  
- [ ] Create sidebar component (`src/components/admin/AdminSidebar.astro`)
  - Navigation menu with icons
  - Active page highlight
  - Collapse toggle
  
- [ ] Create user menu component (`src/components/admin/UserMenu.astro`)
  - Display username/email
  - Logout button

**Acceptance Criteria:**
- Layout displays correctly on desktop
- Sidebar collapses on mobile
- Navigation highlights current page
- User can logout from menu

---

### Day 2: Dashboard

#### Task 2.1: Dashboard Page ⏱️ 3 hours
- [ ] Create dashboard page (`src/pages/admin/index.astro`)
  - Check authentication
  - Display metrics cards
  - Show recent bookings
  - Quick action buttons
  
- [ ] Create metric card component (`src/components/admin/MetricCard.astro`)
  - Display number/stat
  - Icon
  - Label
  - Change indicator (optional)
  
- [ ] Create recent bookings component (`src/components/admin/RecentBookings.astro`)
  - Table of last 5 bookings
  - Customer name, package, date, status
  - Action buttons (view, confirm)
  
- [ ] Create dashboard stats API (`src/pages/api/admin/dashboard/stats.ts`)
  - Count total bookings
  - Count bookings by status (pending, confirmed, cancelled, completed)
  - Sum revenue for current month
  - Count active packages
  - Count active guides
  - Get last 5 bookings

**Acceptance Criteria:**
- Dashboard loads within 2 seconds
- All metrics display correct counts
- Recent bookings show accurate data
- Quick actions navigate correctly
- Mobile layout stacks cards vertically

---

## 🎯 Sprint 2: Package Management (Days 3-5)

### Day 3: Package List

#### Task 3.1: Package List Page ⏱️ 3 hours
- [ ] Create packages index page (`src/pages/admin/packages/index.astro`)
  - Page header with "New Package" button
  - Search bar
  - Filters (region, difficulty, published status)
  - Packages table
  - Pagination
  
- [ ] Create package table component (`src/components/admin/PackageTable.astro`)
  - Columns: Image, Title, Region, Difficulty, Duration, Price, Published, Actions
  - Row actions: Edit, View, Delete
  - Hover states
  - Empty state message
  
- [ ] Create search bar component (`src/components/admin/SearchBar.astro`)
  - Text input with search icon
  - Debounced search (300ms)
  - Clear button
  
- [ ] Create pagination component (`src/components/admin/Pagination.astro`)
  - Page numbers
  - Previous/Next buttons
  - Results per page selector
  
- [ ] Create packages list API (`src/pages/api/admin/packages/index.ts`)
  - GET endpoint with query params
  - Support: search, filters, pagination
  - Use TourPackageRepository
  - Return packages with total count

**Acceptance Criteria:**
- Table displays all packages
- Search filters packages by title/description
- Filters work for region, difficulty, published
- Pagination shows 20 items per page
- Actions buttons navigate correctly

---

### Day 4: Package Form (Part 1)

#### Task 4.1: Basic Package Form ⏱️ 4 hours
- [ ] Create package new page (`src/pages/admin/packages/new.astro`)
  - Form with all sections
  - Save draft / Publish buttons
  - Cancel button
  
- [ ] Create package edit page (`src/pages/admin/packages/[id]/edit.astro`)
  - Load existing package data
  - Pre-populate form
  - Same form as new page
  
- [ ] Create package form component (`src/components/admin/PackageForm.astro`)
  - **Section 1: Basic Information**
    - Title (text, required)
    - Slug (text, auto-generated, editable)
    - Region (select)
    - Difficulty (select)
    - Duration (number)
    - Max group size (number)
    - Published (checkbox)
  
  - **Section 2: Pricing**
    - Base price (number, required)
    - Currency (select, default USD)
    - Special offer price (number, optional)
    - Offer valid until (date, optional)
  
  - **Section 3: Descriptions**
    - Short description (textarea, max 300 chars)
    - Long description (textarea, rich text)
    - Sustainability (textarea, optional)

**Acceptance Criteria:**
- Form validates required fields
- Slug auto-generates from title
- All fields save correctly
- Validation errors display inline

---

### Day 5: Package Form (Part 2)

#### Task 5.1: Itinerary & Images ⏱️ 4 hours
- [ ] Create itinerary builder component (`src/components/admin/ItineraryBuilder.astro`)
  - List of itinerary days
  - Each day: Day #, Title, Description, Distance, Elevation
  - Add day button
  - Remove day button
  - Reorder with up/down arrows
  
- [ ] Create image uploader component (`src/components/admin/ImageUploader.astro`)
  - Featured image upload (single)
  - Gallery images upload (multiple, up to 10)
  - Image preview with thumbnail
  - Remove image button
  - Drag-and-drop support
  - Progress indicator
  
- [ ] Create FAQ builder component (`src/components/admin/FAQBuilder.astro`)
  - List of Q&A pairs
  - Add FAQ button
  - Remove FAQ button
  - Reorder buttons

**Acceptance Criteria:**
- Can add/remove/reorder itinerary days
- Images upload and display previews
- Can upload multiple images at once
- FAQs can be added/removed/reordered

#### Task 5.2: Package Save API ⏱️ 2 hours
- [ ] Create package create API (`src/pages/api/admin/packages/create.ts`)
  - POST endpoint
  - Validate all fields
  - Handle image uploads
  - Save to database via TourPackageRepository
  - Return created package or errors
  
- [ ] Create package update API (`src/pages/api/admin/packages/[id]/update.ts`)
  - PUT endpoint
  - Load existing package
  - Update fields
  - Handle new image uploads
  - Save to database
  - Return updated package or errors

**Acceptance Criteria:**
- Creating package saves all sections correctly
- Updating package preserves existing data
- Images upload and save to `/public/uploads/packages/`
- Validation errors returned with field names

#### Task 5.3: Package Delete ⏱️ 1 hour
- [ ] Create confirm modal component (`src/components/admin/ConfirmModal.astro`)
  - Modal overlay
  - Title and message
  - Confirm/Cancel buttons
  - Close on ESC or cancel
  
- [ ] Create package delete API (`src/pages/api/admin/packages/[id]/delete.ts`)
  - DELETE endpoint
  - Check if package has bookings (prevent delete)
  - Delete associated images
  - Delete from database
  - Return success/error

**Acceptance Criteria:**
- Delete shows confirmation modal
- Can cancel deletion
- Deleting removes package from database
- Associated images are deleted
- Cannot delete package with existing bookings

---

## 🎯 Sprint 3: Guide & Booking Management (Days 6-8)

### Day 6: Guide Management

#### Task 6.1: Guide List Page ⏱️ 2 hours
- [ ] Create guides index page (`src/pages/admin/guides/index.astro`)
  - Similar to packages list
  - Table with guide-specific columns
  
- [ ] Create guide table component (`src/components/admin/GuideTable.astro`)
  - Columns: Image, Title, Region, Distance, Difficulty, Published, Actions
  
- [ ] Create guides list API (`src/pages/api/admin/guides/index.ts`)
  - GET endpoint with filters
  - Use CyclingGuideRepository

**Acceptance Criteria:**
- Table displays all guides
- Search and filters work
- Actions navigate correctly

#### Task 6.2: Guide Form ⏱️ 4 hours
- [ ] Create guide new/edit pages
  - `src/pages/admin/guides/new.astro`
  - `src/pages/admin/guides/[id]/edit.astro`
  
- [ ] Create guide form component (`src/components/admin/GuideForm.astro`)
  - Basic information (title, slug, region, difficulty, distance, duration)
  - Descriptions (short, long, cultural context)
  - Route information (start point, end point, route type, surface type)
  - Practical information (best time, gear, hydration stops)
  - Media (images, route map, GPX file, YouTube videos)
  - SEO fields
  
- [ ] Create route segment builder (`src/components/admin/RouteSegmentBuilder.astro`)
  - List of segments
  - Each: Name, Distance, Description, Points of interest
  - Add/Remove/Reorder
  
- [ ] Create guide save APIs
  - `POST /api/admin/guides/create.ts`
  - `PUT /api/admin/guides/[id]/update.ts`
  - `DELETE /api/admin/guides/[id]/delete.ts`

**Acceptance Criteria:**
- Form saves all guide data correctly
- Route segments can be managed
- Images and GPX files upload
- YouTube URLs validated

---

### Day 7: Booking List

#### Task 7.1: Booking List Page ⏱️ 3 hours
- [ ] Create bookings index page (`src/pages/admin/bookings/index.astro`)
  - Search by customer name/email/booking ID
  - Filters (status, package, date range)
  - Sort by booking date, travel date, amount
  - Export CSV button
  
- [ ] Create booking table component (`src/components/admin/BookingTable.astro`)
  - Columns: ID, Customer, Package, Travel Date, Guests, Total, Status, Booking Date, Actions
  - Status badges with colors
  
- [ ] Create status badge component (`src/components/admin/StatusBadge.astro`)
  - Colored pill based on status
  - PENDING: yellow, CONFIRMED: green, CANCELLED: red, COMPLETED: blue
  
- [ ] Create bookings list API (`src/pages/api/admin/bookings/index.ts`)
  - GET endpoint with filters
  - Support search, filters, pagination
  - Use BookingRepository (need to create)

**Acceptance Criteria:**
- Table shows all bookings
- Search finds bookings by customer or ID
- Filters work correctly
- Status badges display with correct colors
- Pagination works

---

### Day 8: Booking Detail & Email

#### Task 8.1: Booking Detail Page ⏱️ 3 hours
- [ ] Create booking detail page (`src/pages/admin/bookings/[id]/index.astro`)
  - Booking summary section
  - Customer information
  - Tour details
  - Pricing breakdown
  - Status history
  - Actions section
  
- [ ] Create booking detail component (`src/components/admin/BookingDetail.astro`)
  - Display all booking information
  - Status update dropdown
  - Send email button
  - Edit/Cancel buttons
  
- [ ] Create booking update API (`src/pages/api/admin/bookings/[id]/update.ts`)
  - PUT endpoint
  - Update booking status
  - Update booking details
  - Send notification email if status changed

**Acceptance Criteria:**
- Detail page shows all booking info
- Can update booking status
- Status changes trigger email notifications
- Pricing breakdown displays correctly

#### Task 8.2: Email Functionality ⏱️ 2 hours
- [ ] Create email composer component (`src/components/admin/EmailComposer.astro`)
  - To field (pre-filled with customer email)
  - Subject field
  - Message body (textarea)
  - Send button
  
- [ ] Create booking email API (`src/pages/api/admin/bookings/[id]/email.ts`)
  - POST endpoint
  - Send email via NodeMailer
  - Use email templates or custom message
  
- [ ] Create admin email templates (`src/lib/email-templates/admin/`)
  - `booking-confirmation.ts`
  - `booking-cancellation.ts`
  - `payment-reminder.ts`
  - `pre-tour-info.ts`

**Acceptance Criteria:**
- Email composer displays correctly
- Can send confirmation emails
- Can send custom emails
- Email templates format correctly

#### Task 8.3: Booking Export ⏱️ 1 hour
- [ ] Create export API (`src/pages/api/admin/bookings/export.ts`)
  - GET endpoint with same filters as list
  - Generate CSV file
  - Return as download
  - Include all booking fields

**Acceptance Criteria:**
- Export button downloads CSV
- CSV includes all filtered bookings
- All fields properly formatted

---

## 🎯 Sprint 4: Media & Polish (Days 9-10)

### Day 9: Media Library

#### Task 9.1: Media Library Page ⏱️ 3 hours
- [ ] Create media index page (`src/pages/admin/media/index.astro`)
  - Grid view of images
  - Upload area (drag-and-drop)
  - Search by filename
  - Filter by usage
  - Bulk delete
  
- [ ] Create media grid component (`src/components/admin/MediaGrid.astro`)
  - Grid of image cards
  - Each card: thumbnail, filename, size, actions
  - Click to view detail
  
- [ ] Create image upload zone (`src/components/admin/ImageUploadZone.astro`)
  - Drag-and-drop area
  - File picker button
  - Multiple file selection
  - Upload progress bars
  - Preview uploaded images
  
- [ ] Create media upload API (`src/pages/api/admin/media/upload.ts`)
  - POST endpoint
  - Accept multiple files
  - Validate file types (JPG, PNG, WebP)
  - Optimize images (resize, compress)
  - Generate thumbnails
  - Save to `/public/uploads/media/`
  - Store metadata in database (if needed)

**Acceptance Criteria:**
- Can upload multiple images at once
- Drag-and-drop works
- Images display in grid
- Search finds images by filename
- Bulk delete removes selected images

#### Task 9.2: Image Detail Modal ⏱️ 1 hour
- [ ] Create image detail modal (`src/components/admin/ImageDetailModal.astro`)
  - Large preview
  - Edit alt text field
  - Show where used (packages, guides)
  - Copy URL button
  - Delete button
  
- [ ] Create image update API (`src/pages/api/admin/media/[id]/update.ts`)
  - PUT endpoint
  - Update alt text
  
- [ ] Create image delete API (`src/pages/api/admin/media/[id]/delete.ts`)
  - DELETE endpoint
  - Check if image is used
  - Delete file from disk
  - Remove from database

**Acceptance Criteria:**
- Modal shows image details
- Can edit alt text
- Copy URL works
- Delete removes image (with confirmation if used)

---

### Day 10: User Management & Polish

#### Task 10.1: User Management ⏱️ 4 hours
- [ ] Create users index page (`src/pages/admin/users/index.astro`)
- [ ] Create user table component (`src/components/admin/UserTable.astro`)
- [ ] Create user new/edit pages
- [ ] Create user form component (`src/components/admin/UserForm.astro`)
- [ ] Create user APIs (list, create, update, delete)

**Acceptance Criteria:**
- Can view all admin users
- Can create new admin user
- Can edit existing user
- Can delete user (except self)
- Passwords hashed on save

#### Task 10.2: Notifications & Loading States ⏱️ 2 hours
- [ ] Create toast notification component (`src/components/admin/Toast.astro`)
  - Success, error, info, warning variants
  - Auto-dismiss after 5 seconds
  - Close button
  
- [ ] Create spinner component (`src/components/admin/Spinner.astro`)
  - Small, medium, large sizes
  - Inline and overlay variants
  
- [ ] Add loading states to all forms
  - Disable submit button while loading
  - Show spinner
  - Prevent double submission

**Acceptance Criteria:**
- Toasts display on actions
- Spinners show during loading
- Forms can't be double-submitted

---

## 📝 Testing Tasks

### Functionality Tests
- [ ] Test login/logout flow
- [ ] Test session persistence
- [ ] Test package CRUD operations
- [ ] Test guide CRUD operations
- [ ] Test booking status updates
- [ ] Test email sending
- [ ] Test image uploads
- [ ] Test search and filters
- [ ] Test pagination
- [ ] Test validation errors
- [ ] Test bulk actions

### Security Tests
- [ ] Verify unauthenticated users can't access admin
- [ ] Verify CSRF protection works
- [ ] Verify SQL injection prevented
- [ ] Verify XSS attacks prevented
- [ ] Verify rate limiting on login
- [ ] Verify sessions expire correctly

### Performance Tests
- [ ] Dashboard loads < 2s
- [ ] Package list loads < 1s
- [ ] Image upload < 5s per image
- [ ] Search responds < 500ms

### Responsive Tests
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640-1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test navigation on mobile
- [ ] Test forms on mobile

---

## 🚀 Deployment Checklist

- [ ] Set strong SESSION_SECRET in production
- [ ] Create first admin user in database
- [ ] Test database connection
- [ ] Run migrations
- [ ] Seed initial data
- [ ] Test SMTP email sending
- [ ] Configure file upload permissions
- [ ] Set up HTTPS
- [ ] Configure CSP headers
- [ ] Test all routes
- [ ] Verify authentication works
- [ ] Check error pages (404, 500)
- [ ] Monitor server logs

---

## Priority Labels

🔴 **Critical** - Must have for MVP
🟡 **High** - Important but not blocking
🟢 **Medium** - Nice to have
⚪ **Low** - Future enhancement

## Status Indicators

- [ ] Not started
- [⏳] In progress
- [✅] Completed
- [🐛] Bug/Issue
- [⏸️] Blocked/On hold
