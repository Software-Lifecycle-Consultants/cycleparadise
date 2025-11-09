# Data Model: Sri Lanka Cycling Tour Website

**Created**: 2024-11-08  
**Branch**: 001-cycling-tour-website  
**Phase**: 1 - Design & Contracts

## Core Entities

### TourPackage
Represents cycling tour offerings with complete package information.

**Fields**:
- `id`: UUID (Primary Key)
- `title`: String (required) - Package display name
- `slug`: String (unique) - URL-friendly identifier
- `description`: Text - Detailed package description
- `shortDescription`: String - Brief summary for listings
- `itinerary`: JSON - Day-by-day activity breakdown
- `duration`: Integer - Number of days
- `difficultyLevel`: Enum (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `region`: String - Geographic area (e.g., "Central Province", "Southern Coast")
- `basePrice`: Decimal - Starting price per person
- `maxParticipants`: Integer - Maximum group size
- `includedServices`: JSON Array - List of included items
- `excludedServices`: JSON Array - List of excluded items
- `mediaGallery`: JSON - Image URLs and metadata
- `youtubeVideoId`: String (optional) - Embedded video
- `isActive`: Boolean - Published status
- `featured`: Boolean - Homepage featured package
- `metaTitle`: String - SEO title
- `metaDescription`: String - SEO description
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- One-to-many with `Booking`
- Many-to-many with `Accommodation` through `PackageAccommodation`

**Validation Rules**:
- `slug` must be unique across all packages
- `basePrice` must be positive
- `maxParticipants` must be greater than 0
- `difficultyLevel` must be valid enum value

---

### Accommodation
Properties available for booking with tour packages.

**Fields**:
- `id`: UUID (Primary Key)
- `name`: String (required) - Property name
- `slug`: String (unique) - URL-friendly identifier
- `type`: Enum (HOTEL, GUESTHOUSE, RESORT, HOMESTAY, CAMPING)
- `location`: String - City/area location
- `description`: Text - Property description
- `amenities`: JSON Array - List of available amenities
- `pricePerNight`: Decimal - Base price per night per room
- `maxOccupancy`: Integer - Maximum guests per room
- `images`: JSON - Image URLs and metadata
- `contactInfo`: JSON - Phone, email, address
- `rating`: Decimal (1-5) - Property rating
- `isActive`: Boolean - Available for booking
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- One-to-many with `BookingAccommodation`
- Many-to-many with `TourPackage` through `PackageAccommodation`

**Validation Rules**:
- `pricePerNight` must be positive
- `rating` must be between 1.0 and 5.0
- `maxOccupancy` must be greater than 0

---

### Booking
Customer reservation requests with confirmation workflow.

**Fields**:
- `id`: UUID (Primary Key)
- `bookingNumber`: String (unique) - Human-readable booking reference
- `packageId`: UUID (Foreign Key to TourPackage)
- `customerName`: String (required)
- `customerEmail`: String (required)
- `customerPhone`: String (required)
- `customerCountry`: String
- `numberOfParticipants`: Integer (required)
- `startDate`: Date (required)
- `endDate`: Date (required)
- `specialRequests`: Text (optional)
- `totalAmount`: Decimal - Calculated total cost
- `status`: Enum (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `confirmationNotes`: Text - Admin notes for confirmation
- `paymentStatus`: Enum (PENDING, PAID, PARTIAL, REFUNDED)
- `paymentMethod`: Enum (CASH, BANK_TRANSFER, CARD, OTHER)
- `submittedAt`: DateTime
- `confirmedAt`: DateTime (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-one with `TourPackage`
- One-to-many with `BookingAccommodation`

**Validation Rules**:
- `startDate` must be at least 7 days from current date
- `endDate` must be after `startDate`
- `numberOfParticipants` must be positive and not exceed package max
- `customerEmail` must be valid email format
- `totalAmount` must be calculated based on package and accommodations

---

### BookingAccommodation
Junction table linking bookings with selected accommodation options.

**Fields**:
- `id`: UUID (Primary Key)
- `bookingId`: UUID (Foreign Key to Booking)
- `accommodationId`: UUID (Foreign Key to Accommodation)
- `checkInDate`: Date
- `checkOutDate`: Date
- `numberOfRooms`: Integer
- `numberOfNights`: Integer
- `pricePerNight`: Decimal - Price at time of booking
- `totalAccommodationCost`: Decimal - Calculated cost
- `createdAt`: DateTime

**Validation Rules**:
- `checkInDate` must align with tour package dates
- `numberOfRooms` and `numberOfNights` must be positive
- `totalAccommodationCost` must equal `numberOfRooms * numberOfNights * pricePerNight`

---

### CyclingGuide
Regional information and cycling route guides.

**Fields**:
- `id`: UUID (Primary Key)
- `title`: String (required) - Guide title
- `slug`: String (unique) - URL-friendly identifier
- `region`: String (required) - Geographic coverage
- `content`: Text - Detailed guide content (Markdown)
- `routeMap`: JSON - GPS coordinates and route data
- `difficultyRating`: Integer (1-10) - Route difficulty
- `estimatedDuration`: String - Time to complete
- `bestSeason`: String - Optimal visiting months
- `safetyTips`: JSON Array - Important safety information
- `pointsOfInterest`: JSON - Notable locations and attractions
- `images`: JSON - Route and location images
- `isPublished`: Boolean - Visibility status
- `featured`: Boolean - Homepage featured guide
- `metaTitle`: String - SEO title
- `metaDescription`: String - SEO description
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Validation Rules**:
- `slug` must be unique across all guides
- `difficultyRating` must be between 1 and 10
- `content` must not be empty for published guides

---

### AdminUser
Administrative user accounts for content management.

**Fields**:
- `id`: UUID (Primary Key)
- `email`: String (unique, required) - Login email
- `passwordHash`: String (required) - Bcrypt hashed password
- `firstName`: String (required)
- `lastName`: String (required)
- `role`: Enum (ADMIN, EDITOR) - Permission level
- `isActive`: Boolean - Account status
- `lastLoginAt`: DateTime (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- One-to-many with `ContentRevision` (audit trail)

**Validation Rules**:
- `email` must be unique and valid format
- `passwordHash` must be bcrypt format
- Only ADMIN role can create other admin users

---

### MediaAsset
Centralized media file management for images and videos.

**Fields**:
- `id`: UUID (Primary Key)
- `filename`: String (required) - Original filename
- `storageKey`: String (unique) - File system storage identifier
- `mimeType`: String (required) - File MIME type
- `fileSize`: Integer - Size in bytes
- `dimensions`: JSON (optional) - Width/height for images
- `altText`: String (optional) - Accessibility description
- `caption`: String (optional) - Display caption
- `entityType`: String - Associated entity type (TourPackage, Accommodation, etc.)
- `entityId`: UUID (optional) - Associated entity ID
- `uploadedBy`: UUID (Foreign Key to AdminUser)
- `createdAt`: DateTime

**Validation Rules**:
- `mimeType` must be allowed image or video type
- `fileSize` must not exceed configured limits
- `storageKey` must be unique across all assets

---

### InstagramPost
Cached Instagram content for social media integration.

**Fields**:
- `id`: UUID (Primary Key)
- `instagramId`: String (unique) - Instagram post ID
- `caption`: Text - Post caption
- `mediaUrl`: String - Image/video URL
- `mediaType`: Enum (IMAGE, VIDEO, CAROUSEL)
- `permalink`: String - Link to Instagram post
- `hashtags`: JSON Array - Extracted hashtags
- `timestamp`: DateTime - Instagram post timestamp
- `isVisible`: Boolean - Display on website
- `fetchedAt`: DateTime - Last API fetch time
- `createdAt`: DateTime

**Validation Rules**:
- `instagramId` must be unique
- `mediaUrl` must be valid URL
- Content refreshed hourly via API

## Entity Relationships Summary

```
TourPackage ||--o{ Booking : "has bookings"
TourPackage ||--o{ PackageAccommodation : "offers accommodations"
Accommodation ||--o{ PackageAccommodation : "available for packages"
Accommodation ||--o{ BookingAccommodation : "selected in bookings"
Booking ||--o{ BookingAccommodation : "includes accommodations"
AdminUser ||--o{ MediaAsset : "uploads media"
```

## State Transitions

### Booking Status Flow
```
PENDING → CONFIRMED (admin confirmation)
PENDING → CANCELLED (customer or admin cancellation)
CONFIRMED → COMPLETED (post-tour completion)
CONFIRMED → CANCELLED (pre-tour cancellation)
```

### Content Publication Flow
```
Draft → Review → Published (for guides and packages)
Published → Archived (for outdated content)
```

## Database Indices for Performance

**Primary Indices**:
- `TourPackage`: slug, region, difficultyLevel, isActive, featured
- `Accommodation`: slug, location, type, isActive  
- `Booking`: bookingNumber, status, startDate, customerEmail
- `CyclingGuide`: slug, region, isPublished, featured
- `AdminUser`: email
- `InstagramPost`: hashtags, isVisible, timestamp

**Composite Indices**:
- `Booking`: (status, startDate) for admin dashboard filtering
- `TourPackage`: (isActive, featured) for homepage queries
- `MediaAsset`: (entityType, entityId) for content association

## Phase 1 Data Model Complete

All entities defined with validation rules, relationships, and performance considerations. Ready for API contract generation.