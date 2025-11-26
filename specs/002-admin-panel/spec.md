# Admin Panel Specification

## Overview

A secure, user-friendly admin panel for managing Cycle Paradise tour packages, cycling guides, bookings, and content. Built with Astro, integrates with existing PostgreSQL database via Prisma ORM.

## Goals

- Provide non-technical staff ability to manage tour content
- Enable booking management and customer communication
- Secure authentication and authorization
- Responsive design for desktop and mobile
- Integration with existing database schema and repositories

## Non-Goals

- Multi-tenant/multi-organization support
- Advanced analytics/reporting (Phase 2)
- Customer-facing account portal
- Real-time chat support
- Payment gateway integration (handled separately)

## Scope

### In Scope
- Admin login/logout with session management
- Dashboard with key metrics
- Tour package CRUD operations
- Cycling guide CRUD operations
- Booking management (view, update status, cancel)
- Image upload and management
- Admin user management
- Email notification triggers

### Out of Scope
- Customer user management (public users)
- Custom report builder
- Bulk import/export (Phase 2)
- Audit log viewer (Phase 2)
- Advanced permissions/roles (single admin role for now)

## User Personas

### Primary Admin
- **Role:** Tour Manager
- **Tech Level:** Basic computer skills, comfortable with forms
- **Needs:** 
  - Add/edit tour packages and guides
  - View and manage bookings
  - Upload tour images
  - Respond to customer inquiries

### Secondary Admin
- **Role:** Content Manager
- **Tech Level:** Intermediate, familiar with CMS systems
- **Needs:**
  - Update tour descriptions and itineraries
  - Manage pricing and availability
  - SEO optimization (meta tags, descriptions)

## Key Features

### 1. Authentication & Authorization

#### Login System
- **Route:** `/admin/login`
- **Features:**
  - Email/username + password authentication
  - Remember me checkbox (14-day session)
  - Password strength indicator
  - Error messages for invalid credentials
  - CSRF protection
  - Rate limiting (5 attempts per 15 minutes)

#### Session Management
- Secure HTTP-only cookies
- 24-hour session timeout (or 14 days with "remember me")
- Automatic logout on session expiry
- Session validation on all admin routes

#### Password Management
- **Route:** `/admin/forgot-password` (Future)
- Bcrypt hashing with salt rounds: 10
- Password requirements: min 8 chars, 1 uppercase, 1 number

### 2. Dashboard

#### Route: `/admin`

#### Metrics Cards
- **Total Bookings:** Count of all bookings
- **Pending Bookings:** Count of status = PENDING
- **Confirmed Tours:** Count of status = CONFIRMED
- **Revenue (This Month):** Sum of booking prices for current month
- **Active Packages:** Count of published tour packages
- **Active Guides:** Count of published cycling guides

#### Recent Activity
- Last 5 bookings (with customer name, package, date, status)
- Quick actions: View details, Confirm, Cancel

#### Quick Actions
- Create New Package
- Create New Guide
- View All Bookings
- Manage Images

#### Alerts
- Bookings awaiting confirmation (> 24 hours)
- Low availability warnings
- Upcoming tours (next 7 days)

### 3. Tour Package Management

#### List View: `/admin/packages`

**Features:**
- Table with columns: Image, Title, Region, Difficulty, Duration, Price, Published, Actions
- Search by title/description
- Filter by: Region, Difficulty, Published status
- Sort by: Date created, Price, Title
- Pagination (20 per page)
- Bulk actions: Publish, Unpublish, Delete (with confirmation)

**Actions per row:**
- Edit (pencil icon)
- View on site (external link icon)
- Delete (trash icon with confirmation)

#### Create/Edit Package: `/admin/packages/new`, `/admin/packages/[id]/edit`

**Form Sections:**

1. **Basic Information**
   - Title (required, max 100 chars)
   - Slug (auto-generated from title, editable)
   - Region (dropdown: Hill Country, Coastal, Central, Southern, Northern, Eastern)
   - Difficulty (dropdown: Easy, Intermediate, Challenging)
   - Duration (number, days)
   - Max group size (number)
   - Published (checkbox, default: false)

2. **Pricing**
   - Base price (USD, required)
   - Currency (default: USD)
   - Special offer price (optional)
   - Offer valid until (date picker, optional)

3. **Descriptions**
   - Short description (required, max 300 chars, for listings)
   - Long description (rich text editor, for detail page)
   - Sustainability practices (rich text editor, optional)

4. **Itinerary Builder**
   - Day-by-day breakdown
   - Each day: Day number, Title, Description, Distance (km), Elevation gain (m)
   - Add/Remove/Reorder days
   - Drag-and-drop reordering

5. **Images**
   - Featured image (required, recommended: 1200x800px)
   - Gallery images (up to 10, drag to reorder)
   - Image upload with preview
   - Alt text for each image

6. **Additional Details**
   - What's included (multi-line text, one item per line)
   - What's not included (multi-line text, one item per line)
   - What to bring (multi-line text, one item per line)
   - Fitness requirements (textarea)
   - Best time to visit (textarea)

7. **SEO**
   - Meta title (max 60 chars, default: package title)
   - Meta description (max 160 chars, default: short description)
   - OG image (optional, default: featured image)

8. **FAQs**
   - Question/Answer pairs
   - Add/Remove FAQ items
   - Reorder with drag-and-drop

**Validation:**
- All required fields
- Slug uniqueness
- Price must be positive number
- Dates must be valid
- Image file types: JPG, PNG, WebP (max 5MB each)

**Actions:**
- Save Draft (published = false)
- Publish (published = true, shows validation errors if any)
- Save and Continue Editing
- Cancel (confirm if unsaved changes)

### 4. Cycling Guide Management

#### List View: `/admin/guides`

Similar to packages list with columns: Image, Title, Region, Distance, Difficulty, Published, Actions

#### Create/Edit Guide: `/admin/guides/new`, `/admin/guides/[id]/edit`

**Form Sections:**

1. **Basic Information**
   - Title (required)
   - Slug (auto-generated, editable)
   - Region (dropdown)
   - Difficulty (dropdown)
   - Distance (km, required)
   - Elevation gain (m, optional)
   - Duration (hours, required)
   - Published (checkbox)

2. **Descriptions**
   - Short description (max 300 chars)
   - Long description (rich text)
   - Historical/cultural context (rich text, optional)

3. **Route Information**
   - Starting point (text + map coordinates, optional)
   - Ending point (text + map coordinates, optional)
   - Route type (dropdown: Loop, Point-to-Point, Out-and-back)
   - Surface type (checkboxes: Paved, Gravel, Trail, Mixed)

4. **Route Segments**
   - Segment name
   - Distance (km)
   - Description
   - Points of interest
   - Add/Remove/Reorder segments

5. **Practical Information**
   - Best time to visit (textarea)
   - Difficulty notes (textarea)
   - Safety considerations (textarea)
   - Gear recommendations (multi-line, one per line)
   - Hydration stops (multi-line, one per line)
   - Accommodation options (rich text, optional)

6. **Media**
   - Featured image (required)
   - Route map image (optional, recommended)
   - Gallery images (up to 10)
   - GPX file upload (optional, for GPS devices)
   - YouTube video URLs (optional, up to 3)

7. **SEO** (same as packages)

### 5. Booking Management

#### List View: `/admin/bookings`

**Features:**
- Table columns: ID, Customer, Package, Travel Date, Guests, Total, Status, Booking Date, Actions
- Search by: Customer name, email, booking ID
- Filter by: Status, Package, Date range, Number of guests
- Sort by: Booking date, Travel date, Total amount
- Pagination (30 per page)
- Export to CSV

**Status Badge Colors:**
- PENDING: Yellow
- CONFIRMED: Green
- CANCELLED: Red
- COMPLETED: Blue

**Actions per row:**
- View Details (eye icon)
- Send Email (envelope icon)
- Change Status (dropdown)
- Cancel Booking (with confirmation)

#### Booking Detail View: `/admin/bookings/[id]`

**Information Displayed:**

1. **Booking Summary**
   - Booking reference number
   - Status badge
   - Booking date/time
   - Last updated date/time

2. **Customer Information**
   - Full name
   - Email (with mailto: link)
   - Phone (with tel: link)
   - Country
   - Special requests/notes

3. **Tour Details**
   - Package name (link to package detail)
   - Travel start date
   - Travel end date (calculated from package duration)
   - Number of guests (adults/children breakdown if available)
   - Accommodation preference

4. **Pricing Breakdown**
   - Base package price
   - Accommodation cost
   - Number of guests multiplier
   - Subtotal
   - Tax/fees (if applicable)
   - **Total Amount**

5. **Status History**
   - Timeline of status changes
   - Date/time of each change
   - Admin who made the change (if tracked)

**Actions:**
- Update Status (dropdown: Pending → Confirmed → Completed / Cancel at any time)
- Send Confirmation Email (button)
- Send Custom Email (opens email composer)
- Edit Booking Details (limited: dates, guests, accommodation)
- Print/Export Booking (PDF)
- Delete Booking (admin only, with confirmation)

**Email Templates:**
- Booking Confirmation
- Booking Cancellation
- Payment Reminder
- Pre-Tour Information
- Custom Message

### 6. Image Management

#### Route: `/admin/media`

**Features:**
- Grid view of all uploaded images
- Upload multiple images (drag-and-drop or file picker)
- Image details: Filename, Size, Dimensions, Upload date, Used in
- Search by filename
- Filter by: Usage (packages, guides, unused), Upload date
- Bulk delete (with confirmation)
- Image optimization on upload (resize, compress)

**Single Image View:**
- Large preview
- Edit alt text
- See where image is used (packages, guides)
- Copy image URL
- Download original
- Delete (if not used, or with warning if used)

### 7. Admin User Management

#### Route: `/admin/users`

**Features:**
- List all admin users
- Table columns: Username, Email, Last Login, Created, Status, Actions
- Add new admin user
- Edit user details (username, email, reset password)
- Disable/Enable user
- Delete user (except self, with confirmation)

#### Create/Edit User: `/admin/users/new`, `/admin/users/[id]/edit`

**Form Fields:**
- Username (required, unique)
- Email (required, unique, validated)
- Full name (optional)
- Password (required on create, optional on edit)
- Confirm password
- Active status (checkbox)

**Password Reset:**
- Admin can force password reset on next login
- Admin can set temporary password
- User receives email notification

## Design System

### Layout

#### Admin Shell
- **Header:**
  - Logo (links to public site)
  - Main navigation (Dashboard, Packages, Guides, Bookings, Media, Users)
  - User menu (Profile, Settings, Logout)
  - Notifications icon (with badge count)

- **Sidebar:** (Collapsible on mobile)
  - Same navigation as header
  - Current page highlighted
  - Section icons

- **Main Content:**
  - Page title with breadcrumbs
  - Action buttons (top right)
  - Content area
  - Footer (copyright, version)

### Typography
- **Headings:** Inter font family
- **Body:** System font stack
- **Sizes:**
  - H1: 2rem (32px)
  - H2: 1.5rem (24px)
  - H3: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Colors
- **Primary:** #059669 (Green) - for primary actions
- **Success:** #10B981 (Emerald) - for confirmed/success states
- **Warning:** #F59E0B (Amber) - for pending/warning states
- **Danger:** #EF4444 (Red) - for delete/cancel actions
- **Info:** #3B82F6 (Blue) - for informational states
- **Neutral:** Gray scale for text and backgrounds

### Components

#### Buttons
- **Primary:** Green background, white text
- **Secondary:** White background, gray border, dark text
- **Danger:** Red background, white text
- **Sizes:** Small (32px), Medium (40px), Large (48px)

#### Forms
- **Input Fields:** White background, gray border, rounded corners
- **Labels:** Above input, bold, dark gray
- **Help Text:** Below input, small, gray
- **Error State:** Red border, red error message below
- **Success State:** Green border, green checkmark icon

#### Tables
- **Header:** Gray background, bold text
- **Rows:** Alternating white/light gray, hover state
- **Actions:** Icon buttons, appear on row hover
- **Pagination:** Bottom center, with page numbers and prev/next

#### Cards
- White background
- Subtle shadow
- Rounded corners (8px)
- Padding: 1.5rem (24px)

#### Modals
- Overlay with semi-transparent dark background
- Centered white card
- Title, content, action buttons
- Close button (X) in top right
- ESC key to close

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

**Mobile Adaptations:**
- Sidebar collapses to hamburger menu
- Tables become card list views
- Side-by-side forms stack vertically
- Reduced padding/spacing

## Technical Requirements

### Authentication
- Session-based auth with HTTP-only cookies
- Middleware to protect all `/admin/*` routes
- Redirect to login if not authenticated
- Redirect to dashboard if accessing login while authenticated

### Database
- Use existing Prisma repositories
- Transactions for multi-step operations
- Proper error handling and validation
- Database indexes on frequently queried fields

### File Uploads
- Store in `/public/uploads/` directory
- Organize by type: `/uploads/packages/`, `/uploads/guides/`, `/uploads/media/`
- Generate unique filenames (UUID + original extension)
- Image optimization: resize to max 1920px width, compress to 80% quality
- Allowed types: JPG, JPEG, PNG, WebP, GIF
- Max file size: 5MB per image
- Generate thumbnails (400px width) for grid views

### Forms
- Client-side validation with real-time feedback
- Server-side validation before database save
- CSRF token on all POST/PUT/DELETE requests
- Sanitize user input to prevent XSS
- Show loading state during submission
- Success/error notifications after submission

### Performance
- Lazy load images in galleries
- Debounce search inputs (300ms)
- Paginate large lists (20-30 items per page)
- Cache frequently accessed data (dashboard metrics)
- Optimize bundle size (code splitting for admin routes)

### Security
- Rate limiting on login endpoint
- HTTPS required in production
- Secure session cookies
- Input sanitization
- SQL injection prevention (Prisma handles this)
- XSS prevention (escape user content)
- CSRF protection
- Content Security Policy headers

### Error Handling
- User-friendly error messages
- Log errors to console/file
- 404 page for invalid routes
- 500 page for server errors
- Validation error summary at top of forms
- Field-level error messages

## API Endpoints

All endpoints under `/api/admin/` require authentication.

### Packages
- `GET /api/admin/packages` - List packages (with filters, pagination)
- `GET /api/admin/packages/[id]` - Get single package
- `POST /api/admin/packages` - Create package
- `PUT /api/admin/packages/[id]` - Update package
- `DELETE /api/admin/packages/[id]` - Delete package
- `POST /api/admin/packages/bulk` - Bulk actions (publish, unpublish, delete)

### Guides
- `GET /api/admin/guides` - List guides
- `GET /api/admin/guides/[id]` - Get single guide
- `POST /api/admin/guides` - Create guide
- `PUT /api/admin/guides/[id]` - Update guide
- `DELETE /api/admin/guides/[id]` - Delete guide

### Bookings
- `GET /api/admin/bookings` - List bookings (with filters, pagination)
- `GET /api/admin/bookings/[id]` - Get single booking
- `PUT /api/admin/bookings/[id]` - Update booking (status, details)
- `DELETE /api/admin/bookings/[id]` - Cancel booking
- `POST /api/admin/bookings/[id]/email` - Send email to customer
- `GET /api/admin/bookings/export` - Export bookings to CSV

### Media
- `GET /api/admin/media` - List uploaded images
- `POST /api/admin/media/upload` - Upload image(s)
- `PUT /api/admin/media/[id]` - Update image (alt text, etc.)
- `DELETE /api/admin/media/[id]` - Delete image
- `POST /api/admin/media/bulk-delete` - Delete multiple images

### Users
- `GET /api/admin/users` - List admin users
- `GET /api/admin/users/[id]` - Get single user
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard metrics

### Authentication
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/logout` - Logout
- `GET /api/admin/auth/session` - Check session status

## Success Metrics

- **Admin can create a tour package in < 5 minutes**
- **Admin can update booking status in < 30 seconds**
- **Dashboard loads in < 2 seconds**
- **Image upload completes in < 5 seconds per image**
- **Zero critical security vulnerabilities**
- **Mobile responsive score > 90% (Lighthouse)**

## Future Enhancements (Phase 2)

- Advanced analytics dashboard with charts
- Bulk import/export (CSV, Excel)
- Audit log of all admin actions
- Role-based permissions (Manager, Editor, Viewer)
- Email template editor
- Automated booking reminders
- Integration with payment gateways
- Customer review management
- Multi-language content management
- Advanced search with filters
- Scheduled publishing
- Content versioning
