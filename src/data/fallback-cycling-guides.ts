import type { CyclingGuide } from '../types/models.js';

export type EnrichedCyclingGuide = CyclingGuide & {
  slug: string;
  difficultyLevel: 'EASY' | 'INTERMEDIATE' | 'CHALLENGING';
  estimatedDistance: number;
  terrainType: string;
  bestTimeToVisit: string;
  highlights: string[];
  safetyTips: string[];
  gearChecklist: string[];
  nearbyAttractions: string[];
  routeSegments: Array<{ title: string; distance: string; description: string }>;
  hydrationStops: Array<{ name: string; type: string; notes?: string }>;
  faqs: Array<{ question: string; answer: string }>;
  mapImageUrl?: string;
  gpxFileUrl?: string;
  images: string[];
};

const now = new Date('2024-10-01T00:00:00Z');

export const fallbackCyclingGuides: EnrichedCyclingGuide[] = [
  {
    id: 'guide_sigiriya',
    title: 'Sigiriya Rock Fortress Route',
    slug: 'sigiriya-rock-fortress',
    region: 'Central',
    content:
      "Experience the wonder of ancient Sri Lankan civilization as you cycle through terracotta villages, shimmering reservoirs, and jungle-lined double tracks to reach the mighty Sigiriya Rock Fortress.",
    description:
      'A scenic cycling route that takes you to the magnificent Sigiriya Rock Fortress. This moderately challenging ride combines cultural exploration with natural beauty.',
    shortDescription: 'Cycle to the famous Sigiriya Rock Fortress with cultural detours and lush jungle scenery.',
    difficultyLevel: 'INTERMEDIATE',
    difficultyRating: 6,
    estimatedDistance: 32,
    estimatedDuration: '4-5 hours',
  startingPoint: 'Hiriwadunna village hub',
  endingPoint: 'Sigiriya Rock base',
    terrainType: 'Packed red earth, canal-side gravel, and cobblestone climbs',
    bestTimeToVisit: 'October to March mornings',
    highlights: ['UNESCO citadel views', 'Village tank crossings', 'Pidurangala sunrise option'],
    safetyTips: ['Start by 6:30 AM to beat the heat', 'Carry minimum 2L of water', 'Elephants may cross near Hiriwadunna—wait for the ranger signal'],
    gearChecklist: ['Hardtail or gravel bike', 'Front + rear lights', 'Spare tubes / sealant', 'Lightweight lock for photo stops'],
    nearbyAttractions: ['Pidurangala Rock', 'Sigiriya Museum', 'Hiriwadunna village lunch'],
    routeSegments: [
      { title: 'Jungle warm-up', distance: '8 km', description: 'Roll past banana groves and irrigation canals with shaded double track.' },
      { title: 'Canal straight', distance: '12 km', description: 'Faster gravel stretch with kingfisher sightings and optional swim stop.' },
      { title: 'Final ascent', distance: '12 km', description: 'Cobblestone ramp up to the fortress base and bike parking area.' }
    ],
    hydrationStops: [
      { name: 'Hiriwadunna co-op', type: 'Coconut stand', notes: 'Cool water + bananas' },
      { name: 'Sigiriya museum café', type: 'Cafe', notes: 'Air-con break + washrooms' }
    ],
    faqs: [
      { question: 'Can I climb Sigiriya after riding?', answer: 'Yes, secure your bike at the guarded rack near the ticket office and carry a change of shoes.' },
      { question: 'Is a guide required?', answer: 'Not mandatory, but local ride captains share shortcuts and wildlife briefings.' }
    ],
  mapImageUrl: '/images/sigiriya-map.jpg',
  gpxFileUrl: '/routes/sigiriya.gpx',
  images: ['/images/sigiriya-route-1.jpg', '/images/sigiriya-route-2.jpg', '/images/sigiriya-route-3.jpg'],
    isPublished: true,
    featured: true,
    metaTitle: 'Sigiriya Rock Cycling Guide - Cycle Paradise',
    metaDescription: 'Detailed route intel, safety notes, and GPX download for the iconic Sigiriya cycling approach.',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'guide_galle_coastal',
    title: 'Galle Fort Coastal Ride',
    slug: 'galle-fort-coastal',
    region: 'Southern',
    content:
      'Discover the charm of Sri Lanka\'s southern coast on this easy cycling adventure linking lighthouse viewpoints, cinnamon estates, and beach cafés perfect for sunset dips.',
    description:
      'A relaxing coastal cycling experience along Sri Lanka\'s southern coast, starting from the historic Galle Fort and following pristine beaches and fishing villages.',
    shortDescription: 'Scenic coastal ride from historic Galle Fort to Unawatuna with lagoon detours.',
    difficultyLevel: 'EASY',
    difficultyRating: 3,
    estimatedDistance: 22,
    estimatedDuration: '2-3 hours',
  startingPoint: 'Galle Fort clock tower',
  endingPoint: 'Unawatuna Beach',
    terrainType: 'Flat coastal roads & boardwalks',
    bestTimeToVisit: 'November to April late afternoons',
    highlights: ['Fort rampart ride', 'Jungle Beach swim', 'Koggala stilt fishers'],
    safetyTips: ['Watch for buses near the cricket stadium', 'High UV—reapply sunscreen hourly', 'Sea breeze crosswinds on boardwalk'],
    gearChecklist: ['Sun sleeves + buff', 'Flip flops for beach cafes', 'Cashless payment app', 'Swim kit in dry bag'],
    nearbyAttractions: ['Galle Lighthouse', 'Jungle Beach', 'Martin Wickramasinghe Museum'],
    routeSegments: [
      { title: 'Rampart loop', distance: '5 km', description: 'Pave loop atop fort walls with cannons and harbour views.' },
      { title: 'Coastal cruise', distance: '11 km', description: 'Palm-lined stretch with stilt fishermen and spice gardens.' },
      { title: 'Lagoon boardwalk', distance: '6 km', description: 'Wooden path skirting Koggala Lake with birdlife blinds.' }
    ],
    hydrationStops: [
      { name: 'Coconut cart near Lighthouse', type: 'Street vendor' },
      { name: 'Wijaya Beach Café', type: 'Cafe', notes: 'Best lime soda + restrooms' }
    ],
    faqs: [
      { question: 'Is night riding safe?', answer: 'Stick to daylight hours—after sunset the boardwalk lighting is limited.' },
      { question: 'Are rentals available?', answer: 'Yes, beach cruisers and step-through e-bikes can be arranged in Galle Fort.' }
    ],
    mapImageUrl: '/images/galle-map.jpg',
    gpxFileUrl: '/routes/galle-coastal.gpx',
  images: ['/images/galle-coastal-1.jpg', '/images/galle-coastal-2.jpg'],
  routeMap: null,
  pointsOfInterest: null,
    isPublished: true,
    featured: true,
    metaTitle: 'Galle Fort Coastal Ride Guide - Cycle Paradise',
    metaDescription: 'Easy coastal cycling guide with GPX download, coffee stops, and fort history highlights.',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'guide_ella_nine_arch',
    title: 'Ella to Nine Arch Bridge',
    slug: 'ella-nine-arch-bridge',
    region: 'Central Highlands',
    content:
      'Challenge yourself with this mountain cycling adventure through tea country switchbacks, pine forests, and the famous Nine Arch Bridge with waterfall swim stops en route.',
    description: 'A challenging mountain cycling route through Sri Lanka\'s hill country, featuring tea plantations, mountain views, and the famous Nine Arch Bridge.',
    shortDescription: 'Mountain adventure to the iconic Nine Arch Bridge with optional hike extensions.',
    difficultyLevel: 'CHALLENGING',
    difficultyRating: 8,
    estimatedDistance: 26,
    estimatedDuration: '3-4 hours',
  startingPoint: 'Ella Town',
  endingPoint: 'Nine Arch Bridge viewpoint',
    terrainType: 'Steep tea estate climbs & stone viaduct approaches',
    bestTimeToVisit: 'December to March mornings',
    highlights: ['Nine Arch Bridge crossing', 'Little Adam\'s Peak spur', 'Waterfall plunge pools'],
    safetyTips: ['Check brakes before descents', 'Fog can reduce visibility—use lights', 'Yield to tea estate tractors'],
    gearChecklist: ['Full-suspension or quality hardtail', 'Compact rain jacket', 'Warm layers for descents', 'Chain lube for misty rides'],
    nearbyAttractions: ["Little Adam's Peak", 'Ravana Falls', 'Diyaluma Falls day-trip'],
    routeSegments: [
      { title: 'Ella Gap climb', distance: '7 km', description: 'Smooth tarmac with 8% average gradient and sweeping valley drops.' },
      { title: 'Tea estate traverse', distance: '9 km', description: 'Gravel ribbons through Lipton estate with worker village visits.' },
      { title: 'Bridge finale', distance: '10 km', description: 'Stone viaduct approach with wooden planks and train timings to consider.' }
    ],
    hydrationStops: [
      { name: 'Kinellan Tea Shed', type: 'Tea kiosk', notes: 'Hot roti + refills' },
      { name: 'Nine Arch viewpoint café', type: 'Cafe', notes: 'Queues for latte during train crossings' }
    ],
    faqs: [
      { question: 'Can non-riders join?', answer: 'Yes, accompany in the support van and hike the final kilometer to the bridge.' },
      { question: 'Is the route technical?', answer: 'Expect loose gravel and wet moss on the viaduct trail—intermediate MTB skills recommended.' }
    ],
    mapImageUrl: '/images/ella-map.jpg',
    gpxFileUrl: '/routes/ella-nine-arch.gpx',
  images: ['/images/ella-bridge-1.jpg', '/images/ella-bridge-2.jpg'],
  routeMap: null,
  pointsOfInterest: null,
    isPublished: true,
    featured: false,
    metaTitle: 'Ella to Nine Arch Bridge Cycling Guide - Cycle Paradise',
    metaDescription: 'Technical hill-country cycling guide with GPX file, train timings, and safety intel for Ella’s famous bridge.',
    createdAt: now,
    updatedAt: now
  }
];

export const getFallbackGuideBySlug = (slug: string) =>
  fallbackCyclingGuides.find((guide) => guide.slug === slug);

export const getFallbackGuideSlugs = () => fallbackCyclingGuides.map((guide) => guide.slug);

export const getRelatedFallbackGuides = (slug: string, region?: string, limit: number = 3) => {
  const pool = fallbackCyclingGuides.filter((guide) => guide.slug !== slug);
  if (region) {
    const matches = pool.filter((guide) => guide.region === region);
    if (matches.length >= limit) {
      return matches.slice(0, limit);
    }
  }
  return pool.slice(0, limit);
};
