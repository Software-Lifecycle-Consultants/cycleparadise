# Build Full Admin Package Management UI with JSON Field Support

## Problem
The admin panel at `/admin/packages/[id]` currently only supports 12 basic fields (title, duration, price, etc.). The database schema has 10 additional JSON fields for complex data (highlights, itinerary, FAQs, reviews, etc.) that cannot be edited through the admin panel.

**User requirement**: "As an admin I want to be able to set those data when creating new packages through the admin panel and also edit the currently prevailing packages"

## Current State Analysis

### ✅ What's Already Working
- Database schema has all necessary JSON fields defined (`highlights`, `itinerary`, `faqs`, `reviews`, `includedServices`, `excludedServices`, `whatToBring`, `supportContacts`, `sustainability`, `mediaGallery`)
- Frontend already uses database-first, fallback-second pattern
- Basic CRUD API endpoints exist at `/api/admin/packages/*`
- Type definitions are complete in `/src/types/models.ts`

### ❌ What's Missing
- **Admin UI**: No form fields for editing JSON data
- **API Support**: POST/PUT endpoints don't accept or persist JSON fields
- **Components**: No reusable editors for arrays, objects, or nested structures

## Implementation Approach

**Strategy**: Feature-by-feature implementation (build API + UI for each JSON field together)
**UX Level**: Simple & functional - text inputs only, no HTML/structural editing, no reordering
**Key Principle**: All JSON fields are OPTIONAL - frontend skips rendering sections with no data

## Implementation Plan

### Feature 1: Highlights (String Array) - PROOF OF CONCEPT

**Step 1A: Update API Endpoint**
- File: `/src/pages/api/admin/packages/index.ts` (POST handler, lines 104-149)
- File: `/src/pages/api/admin/packages/[id].ts` (PUT handler, lines 51-100)
- Add `highlights` field to request body parsing
- Validate: `highlights` is either `null`, `undefined`, or `string[]`
- Persist to database: `highlights: body.highlights || null`

**Step 1B: Create Simple Array Editor Component**
- File: `/src/components/admin/ArrayEditor.astro` (NEW)
- Props: `name`, `items`, `label`, `placeholder`
- Features:
  - Display list of existing items (read-only text inputs)
  - "Add Item" button (adds new empty input)
  - "Remove" button for each item
  - NO reordering capability
  - Hidden JSON input for form submission

**Step 1C: Add to Admin Form**
- File: `/src/pages/admin/packages/[id].astro`
- Add highlights section after existing fields
- Add form submission handler to serialize highlights array to hidden input

**Step 1D: Test End-to-End**
- Create package with highlights
- Edit package highlights
- Verify frontend displays highlights correctly
- Test with empty/null highlights (section should not render)

### Feature 2: Itinerary (Complex Object Array)

**Step 2A: Update API Endpoint**
- Add `itinerary` field parsing
- Validate structure: `Array<{ day, title, description, distance?, elevationGain?, meals? }>` or `null`

**Step 2B: Create Itinerary Editor Component**
- File: `/src/components/admin/ItineraryEditor.astro` (NEW)
- Each day is a card with fields:
  - Day number (auto-numbered, read-only)
  - Title (text input)
  - Description (textarea)
  - Distance (text input, optional)
  - Elevation Gain (text input, optional)
  - Meals (text input, optional)
- "Add Day" button
- "Remove Day" button
- NO reordering (days stay in order added)

**Step 2C: Add to Admin Form & Test**

### Feature 3: What to Bring (String Array)

**Step 3A: Update API Endpoint**
- Add `whatToBring` field

**Step 3B: Reuse ArrayEditor Component**
- Add whatToBring section to admin form
- Test end-to-end

### Feature 4: Included & Excluded Services (String Arrays)

**Step 4A: Update API Endpoint**
- Add `includedServices` and `excludedServices` fields

**Step 4B: Reuse ArrayEditor Component**
- Add two sections to admin form
- Test end-to-end

### Feature 5: FAQs (Object Array)

**Step 5A: Update API Endpoint**
- Add `faqs` field
- Validate: `Array<{ question, answer }>` or `null`

**Step 5B: Create FAQ Editor Component**
- File: `/src/components/admin/FAQEditor.astro` (NEW)
- Each FAQ is a card with:
  - Question (text input)
  - Answer (textarea)
- "Add FAQ" button
- "Remove FAQ" button
- NO reordering

**Step 5C: Add to Admin Form & Test**

### Feature 6: Reviews (Object Array)

**Step 6A: Update API Endpoint**
- Add `reviews` field
- Validate: `Array<{ author, role?, rating?, date?, content }>` or `null`

**Step 6B: Create Reviews Editor Component**
- File: `/src/components/admin/ReviewsEditor.astro` (NEW)
- Each review card has:
  - Author (text input)
  - Role (text input, optional)
  - Rating (number input 1-5, optional)
  - Date (date input, optional)
  - Content (textarea)
- "Add Review" button
- "Remove Review" button

**Step 6C: Add to Admin Form & Test**

### Feature 7: Support Contacts (Object Array)

**Step 7A: Update API Endpoint**
- Add `supportContacts` field
- Validate: `Array<{ label, value, href? }>` or `null`

**Step 7B: Create Support Contacts Editor**
- File: `/src/components/admin/SupportContactsEditor.astro` (NEW)
- Each contact has:
  - Label (text input, e.g., "Email", "Phone")
  - Value (text input, e.g., "info@example.com")
  - Href (text input, optional, e.g., "mailto:info@example.com")

**Step 7C: Add to Admin Form & Test**

### Feature 8: Sustainability (Single Object)

**Step 8A: Update API Endpoint**
- Add `sustainability` field
- Validate: `{ carbonOffset?, communityImpact?, supportVehicle? }` or `null`

**Step 8B: Create Sustainability Editor**
- File: `/src/components/admin/SustainabilityEditor.astro` (NEW)
- Simple form with:
  - Carbon Offset (textarea, optional)
  - Community Impact (textarea, optional)
  - Support Vehicle (checkbox, optional)

**Step 8C: Add to Admin Form & Test**

### Feature 9: Media Gallery (Object with Image Array)

**Step 9A: Update API Endpoint**
- Add `mediaGallery` field
- Validate: `{ images?: Array<{ url, alt }> }` or `null`

**Step 9B: Create Media Gallery Editor**
- File: `/src/components/admin/MediaGalleryEditor.astro` (NEW)
- Each image has:
  - URL (text input for image URL)
  - Alt text (text input)
  - Simple thumbnail preview (if URL is valid)
- "Add Image" button
- "Remove Image" button
- NO reordering

**Step 9C: Add to Admin Form & Test**

## Files to Modify & Create

### API Layer (Modified)
1. `/src/pages/api/admin/packages/index.ts` - POST handler accepts all JSON fields
2. `/src/pages/api/admin/packages/[id].ts` - PUT handler accepts all JSON fields

### Components (NEW - Create as needed for each feature)
1. `/src/components/admin/ArrayEditor.astro` - For string arrays (highlights, whatToBring, services)
2. `/src/components/admin/ItineraryEditor.astro` - For itinerary days
3. `/src/components/admin/FAQEditor.astro` - For FAQ pairs
4. `/src/components/admin/ReviewsEditor.astro` - For customer reviews
5. `/src/components/admin/SupportContactsEditor.astro` - For contact info
6. `/src/components/admin/SustainabilityEditor.astro` - For sustainability data
7. `/src/components/admin/MediaGalleryEditor.astro` - For image gallery

### Admin Pages (Modified)
- `/src/pages/admin/packages/[id].astro` - Add all editor components + form serialization

### Frontend (NO CHANGES NEEDED)
- Frontend already conditionally renders sections based on data availability
- If JSON field is `null` or empty, section won't display

## Key Technical Notes

### Form Submission Pattern
Each editor component will:
1. Display form inputs for content editing
2. Have a hidden `<input type="hidden" name="fieldName-json" />`
3. Before form submit, JavaScript serializes visible inputs into hidden field
4. Server receives pre-serialized JSON string, parses it, validates it

### Validation Strategy
- **Client-side**: Basic required field checks before serialization
- **Server-side**: Strict type validation using TypeScript interfaces
- All fields are optional - `null` is always valid

### Error Handling
- Invalid JSON structures return 400 with specific error message
- Partial updates supported - only send changed fields
- Database errors return 500 with generic message (log details server-side)

## Testing Approach (Test After Each Feature)

For each feature implemented:
1. ✅ Create new package with field populated
2. ✅ Edit existing package field
3. ✅ Save with empty/null field (verify frontend skips section)
4. ✅ Test special characters in text fields
5. ✅ Verify database persistence
6. ✅ Check frontend displays data correctly

## Success Criteria

- ✅ Admin can create packages with all 10 JSON fields through UI
- ✅ Admin can edit all JSON fields for existing packages
- ✅ Optional fields can be left empty (no errors)
- ✅ Frontend conditionally renders sections (only show if data exists)
- ✅ No structural/HTML editing capability (content only)
- ✅ Simple, functional UI (no drag-and-drop or rich text)
