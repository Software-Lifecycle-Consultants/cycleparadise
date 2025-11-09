# Quickstart Guide: Sri Lanka Cycling Tour Website

**Created**: 2024-11-08  
**Branch**: 001-cycling-tour-website  
**Phase**: 1 - Design & Contracts

## Development Environment Setup

### Prerequisites
- Node.js 18+ with npm
- PostgreSQL 14+ (local or Docker)
- Git for version control

### Initial Setup
```bash
# Clone and setup project
git checkout 001-cycling-tour-website
npm install

# Database setup
cp .env.example .env
# Edit .env with database credentials

# Run database migrations
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cycleparadise"
ADMIN_SESSION_SECRET="your-session-secret-here"
EMAIL_SMTP_HOST="smtp.sendgrid.net"
EMAIL_SMTP_USER="apikey"
EMAIL_SMTP_PASS="your-sendgrid-api-key"
INSTAGRAM_ACCESS_TOKEN="your-instagram-token"
BASE_URL="http://localhost:4321"
```

## User Story Testing Scenarios

### User Story 1: Discover and Browse Cycling Packages (Priority P1)

#### Test Scenario 1.1: Homepage Package Discovery
**Objective**: Verify visitors can discover featured cycling packages

**Steps**:
1. Navigate to `http://localhost:4321`
2. Observe homepage loads within 2 seconds
3. Verify featured packages section displays
4. Check each package shows: image, title, brief description, price
5. Verify responsive layout on mobile device

**Expected Results**:
- Homepage loads completely in <2 seconds
- Featured packages section visible with 3-6 packages
- Each package card shows required information
- Mobile layout maintains usability

**Acceptance Criteria**: ✅ Pass if all packages display correctly and page meets performance targets

#### Test Scenario 1.2: Package Detail Exploration  
**Objective**: Verify detailed package information accessibility

**Steps**:
1. Click on any featured package from homepage
2. Verify package detail page loads with complete information
3. Check presence of: full description, itinerary, pricing, included/excluded services
4. Verify image gallery functionality (if multiple images)
5. Test embedded YouTube video playback (if present)
6. Check Instagram social feed display

**Expected Results**:
- Package detail page loads within 2 seconds
- All package information clearly displayed
- Media content (images, video) loads properly
- Instagram feed shows recent posts with cycling hashtags

#### Test Scenario 1.3: Cycling Guide Access
**Objective**: Verify cycling guide content accessibility and usefulness

**Steps**:
1. Navigate to cycling guides section
2. Browse guides by region
3. Open detailed guide for specific region
4. Verify route information, difficulty rating, and safety tips
5. Check mobile responsiveness of guide content

**Expected Results**:
- Guides organized clearly by region
- Detailed guide content includes practical cycling information
- Mobile-friendly reading experience

### User Story 2: Book Tours and Accommodation (Priority P2)

#### Test Scenario 2.1: Package Booking Flow
**Objective**: Verify booking process from package selection to confirmation

**Steps**:
1. Select a tour package from listings
2. Click "Book Now" button
3. Choose start date (minimum 7 days from today)
4. Select number of participants
5. Choose accommodation options
6. Fill booking form with customer details
7. Submit booking request
8. Verify confirmation message and email

**Test Data**:
```json
{
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com", 
  "customerPhone": "+1234567890",
  "customerCountry": "United States",
  "numberOfParticipants": 2,
  "startDate": "2024-11-20",
  "specialRequests": "Vegetarian meals preferred"
}
```

**Expected Results**:
- Calendar prevents selection of dates less than 7 days ahead
- Accommodation options display with pricing
- Form validation prevents submission with missing required fields
- Booking confirmation displays booking number
- Email notifications sent to customer and admin

#### Test Scenario 2.2: Booking Status Check
**Objective**: Verify customers can check booking status

**Steps**:
1. Use booking number from previous test
2. Navigate to booking status page
3. Enter booking number and customer email
4. Verify booking details display correctly

**Expected Results**:
- Booking status shows "PENDING" 
- All booking details match submitted information
- Clear next steps communicated to customer

### User Story 3: Admin Content Management (Priority P3)

#### Test Scenario 3.1: Admin Authentication
**Objective**: Verify secure admin access

**Steps**:
1. Navigate to `/admin` 
2. Attempt login with invalid credentials
3. Verify error message
4. Login with valid admin credentials
5. Verify admin dashboard access

**Test Data**:
```json
{
  "email": "admin@cycleparadise.com",
  "password": "SecureAdminPass123!"
}
```

**Expected Results**:
- Invalid login attempts rejected with appropriate error
- Valid login provides access to admin dashboard
- Session persists across page refreshes

#### Test Scenario 3.2: Package Management
**Objective**: Verify admin can manage tour packages

**Steps**:
1. Login to admin panel
2. Navigate to package management
3. Create new tour package with required information
4. Upload images to package gallery
5. Publish package
6. Verify package appears on public site
7. Edit package details
8. Verify changes reflected on public site

**Test Data**:
```json
{
  "title": "Kandy Hills Adventure",
  "description": "Explore the scenic hills around Kandy...",
  "duration": 3,
  "difficultyLevel": "INTERMEDIATE", 
  "region": "Central Province",
  "basePrice": 150.00,
  "maxParticipants": 8
}
```

**Expected Results**:
- Package creation form validates required fields
- Image upload processes successfully
- New package visible on public site immediately
- Package edits appear in real-time

#### Test Scenario 3.3: Booking Management
**Objective**: Verify admin can manage customer bookings

**Steps**:
1. Access admin booking dashboard
2. Review pending booking from Test Scenario 2.1
3. Confirm booking with payment instructions
4. Verify customer receives confirmation email
5. Check booking status updated to "CONFIRMED"

**Expected Results**:
- Pending bookings list displays complete information
- Booking confirmation process sends appropriate notifications
- Booking status updates correctly in system

## API Testing Scenarios

### Public API Endpoints

#### Test API 1: Package Listing
```bash
# Test package listing with filtering
curl "http://localhost:4321/api/v1/packages?region=Central%20Province&difficulty=INTERMEDIATE"

# Expected: JSON response with filtered packages
# Response time: <200ms
```

#### Test API 2: Booking Submission
```bash
# Test booking creation
curl -X POST "http://localhost:4321/api/v1/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "uuid-from-previous-test",
    "customerName": "Jane Smith",
    "customerEmail": "jane.smith@example.com",
    "customerPhone": "+1987654321",
    "numberOfParticipants": 1,
    "startDate": "2024-11-25"
  }'

# Expected: 201 Created with booking number
```

#### Test API 3: Search Functionality
```bash
# Test search across content types
curl "http://localhost:4321/api/v1/search?q=mountain%20cycling"

# Expected: JSON with packages, guides, and accommodations
# Response time: <1 second
```

### Admin API Endpoints

#### Test API 4: Admin Authentication
```bash
# Test admin login
curl -X POST "http://localhost:4321/api/v1/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cycleparadise.com",
    "password": "SecureAdminPass123!"
  }'

# Expected: 200 OK with session cookie
```

## Performance Testing

### Lighthouse Audit
```bash
# Run Lighthouse performance audit
npm run test:performance

# Expected scores:
# Performance: >90
# Accessibility: >90  
# Best Practices: >90
# SEO: >90
```

### Load Testing
```bash
# Test API performance under load
npm run test:load

# Expected:
# 95th percentile response time <200ms
# 100 concurrent users supported
# Zero error rate under normal load
```

## Integration Testing

### Email Notifications
1. Submit test booking
2. Verify customer confirmation email received
3. Confirm booking via admin
4. Verify customer receives payment instructions email
5. Check all emails render correctly in various clients

### Instagram Integration
1. Verify Instagram posts refresh hourly
2. Check fallback behavior when API unavailable
3. Test hashtag filtering displays relevant content only

### Database Integrity
1. Verify booking dates validate against package availability
2. Test concurrent booking scenarios
3. Confirm data consistency after admin modifications

## Success Criteria Validation

### Performance Metrics
- [ ] Google PageSpeed score >90 (both mobile/desktop)
- [ ] Page load time <2 seconds on 3G connection
- [ ] API response time <200ms for 95th percentile
- [ ] Search results return in <1 second

### User Experience Metrics  
- [ ] Booking completion rate >70% for started flows
- [ ] 3-click maximum to reach booking form from homepage
- [ ] Mobile users have equivalent functionality to desktop
- [ ] WCAG 2.1 AA compliance verified

### Business Metrics
- [ ] Admin content updates visible within 30 seconds
- [ ] 95% email delivery success rate
- [ ] Zero critical security vulnerabilities
- [ ] 7-day advance booking minimum enforced

## Troubleshooting Guide

### Common Issues

**Database Connection Errors**:
```bash
# Check PostgreSQL status
sudo service postgresql status

# Reset database if needed
npm run db:reset
```

**Image Upload Failures**:
```bash
# Check upload directory permissions
ls -la public/uploads

# Verify file size limits in configuration
grep -r "FILE_SIZE_LIMIT" src/
```

**Email Delivery Issues**:
```bash
# Test SMTP configuration
npm run test:email

# Check email service provider status
# Verify API keys and credentials
```

**Instagram API Errors**:
```bash
# Check API token validity
npm run test:instagram

# Verify hashtag configuration
# Check rate limiting status
```

### Development Commands

```bash
# Database operations
npm run db:migrate      # Run pending migrations
npm run db:seed         # Seed development data
npm run db:reset        # Reset database completely

# Testing commands
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # End-to-end tests
npm run test:api        # API contract tests

# Build and deployment
npm run build           # Production build
npm run preview         # Preview production build
npm run deploy          # Deploy to staging/production
```

This quickstart guide provides comprehensive testing scenarios for all user stories and technical requirements. Each test includes specific steps, expected results, and validation criteria aligned with the success criteria defined in the specification.