import type { TourPackage } from '../types/models.js';

export type EnrichedTourPackage = TourPackage & {
  price: number;
  images: string[];
  maxGroupSize: number;
  videoUrl?: string | null;
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    distance?: string;
    elevationGain?: string;
    meals?: string;
  }>;
  whatToBring: string[];
  faqs: Array<{ question: string; answer: string }>;
  reviews: Array<{
    author: string;
    role: string;
    rating: number;
    date: string;
    content: string;
  }>;
  supportContacts: Array<{ label: string; value: string; href?: string }>;
  sustainability: {
    carbonOffset: string;
    communityImpact: string;
    supportVehicle: boolean;
  };
};

type MediaGallery = { images: Array<{ url: string; alt: string }> };

const makeGallery = (images: string[], title: string): MediaGallery => ({
  images: images.map((url, index) => ({ url, alt: `${title} photo ${index + 1}` }))
});

export const fallbackTourPackages: EnrichedTourPackage[] = [
  {
    id: 'pkg_hill_country',
    title: 'Hill Country Explorer',
    slug: 'hill-country-explorer',
    description:
      "Cycle through misty tea plantations, cascading waterfalls, and colonial hill towns while staying in boutique eco-lodges across Sri Lanka's central highlands.",
    shortDescription: 'Tea plantations, cool climates, and elevated climbs across the Central Highlands.',
    itinerary: [
      {
        day: 1,
        title: 'Kandy heritage warm-up',
        description: 'Arrival, bike fitting, and an evening shakedown ride around Kandy Lake and the Temple of the Tooth.',
        distance: '18 km',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Tea factory climbs',
        description: 'Ride from Kandy to Hatton via winding plantation roads with tea tasting and planter high tea.',
        distance: '62 km',
        elevationGain: '1,200 m',
        meals: 'Breakfast / Lunch'
      },
      {
        day: 3,
        title: 'Adam’s Peak foothills',
        description: 'Sunrise hike option followed by a gravity-fed ride through pine forests and reservoirs.',
        distance: '48 km',
        meals: 'Breakfast / Dinner'
      },
      {
        day: 4,
        title: 'Nuwara Eliya switchbacks',
        description: 'Challenge day with crisp-air climbs, strawberry farms, and a hot chocolate reward at Pedro Estate.',
        distance: '55 km',
        elevationGain: '1,450 m'
      },
      {
        day: 5,
        title: 'Highland rail trail',
        description: 'Ride parallel to the iconic train line, catching glimpses of Nine Arch Bridge before descending to Ella.',
        distance: '58 km'
      }
    ],
    whatToBring: [
      'Layered cycling apparel for cool mornings',
      'Compact rain shell for misty conditions',
      '2L hydration bladder or twin bottles',
      'Personal snacks or electrolytes',
      'Camera with extra batteries'
    ],
    faqs: [
      {
        question: 'Do I need to be an advanced rider?',
        answer:
          'Intermediate fitness is sufficient. The support van shadows every climb and riders can hop in if a section feels too demanding.'
      },
      {
        question: 'Are e-bikes available?',
        answer: 'Yes, a limited number of pedal-assist bikes can be reserved in advance for an additional USD 35 per day.'
      }
    ],
    reviews: [
      {
        author: 'Mira Sanderson',
        role: 'Adventure photographer',
        rating: 5,
        date: 'June 2024',
        content:
          'Flawless logistics and the guides knew every coffee stop by heart. The plantation descents to Ella were pure flow.'
      },
      {
        author: 'Devaka Perera',
        role: 'Repeat guest',
        rating: 4.5,
        date: 'April 2024',
        content:
          'Loved the mixture of heritage stops and big mountain scenery. Support crew kept every bike dialed.'
      }
    ],
    supportContacts: [
      { label: 'Whatsapp concierge', value: '+94 77 256 8841', href: 'https://wa.me/94772568841' },
      { label: 'Emergency rider line', value: '+94 71 889 1144', href: 'tel:+94718891144' }
    ],
    sustainability: {
      carbonOffset: 'Fully offset via Sri Lanka Carbon Fund with native reforestation add-on.',
      communityImpact: 'Tea estate homestays and women-run spice gardens share 15% of tour profits.',
      supportVehicle: true
    },
    duration: 5,
    difficultyLevel: 'INTERMEDIATE' as any,
    region: 'Central Highlands',
    basePrice: 1299,
    price: 1299,
    maxParticipants: 12,
    maxGroupSize: 12,
    includedServices: ['Premium Trek or Giant hardtail', 'Professional ride leaders', 'Support van + mechanic', '4 nights boutique lodging', 'All breakfasts & selected meals'],
    excludedServices: ['International flights', 'Personal insurance', 'Alcoholic beverages', 'Single-room supplement'],
    highlights: ['Tea factory cupping', 'Highland rail trail', 'Adam’s Peak sunrise option', 'Ella canyon descent'],
    images: ['/images/hill-country-1.jpg', '/images/hill-country-2.jpg', '/images/hill-country-3.jpg'],
    mediaGallery: makeGallery(
      ['/images/hill-country-1.jpg', '/images/hill-country-2.jpg', '/images/hill-country-3.jpg', '/images/hill-country-4.jpg'],
      'Hill Country Explorer'
    ),
    videoUrl: 'dQw4w9WgXcQ',
    isActive: true,
    featured: true,
    metaTitle: 'Hill Country Explorer Cycling Tour - Cycle Paradise',
    metaDescription: 'Five-day elevated ride through Sri Lanka’s Central Highlands with tea estates, waterfalls, and boutique stays.',
    createdAt: new Date('2024-02-01T00:00:00Z'),
    updatedAt: new Date('2024-10-01T00:00:00Z')
  },
  {
    id: 'pkg_coastal_adventure',
    title: 'Southern Coastal Adventure',
    slug: 'coastal-adventure',
    description:
      'Cruise palm-fringed roads, explore stilt fishing villages, and swim with sea turtles on this sun-soaked coastal itinerary from Galle to Tangalle.',
    shortDescription: 'Laid-back coastal riding with seafood feasts, mangrove detours, and boutique beach stays.',
    itinerary: [
      { day: 1, title: 'Galle ramparts sunset spin', description: 'Arrival spin atop UNESCO-listed fort walls before seafood welcome dinner.', distance: '12 km' },
      { day: 2, title: 'Lighthouse to lagoon', description: 'Boardwalk ride past Koggala Lake spice islands with cinnamon tasting.', distance: '38 km' },
      { day: 3, title: 'Stilt fisherman encounter', description: 'Coastal gravel segments with surf break coffee stops and optional SUP session.', distance: '42 km' },
      { day: 4, title: 'Tangalle turtle patrol', description: 'Dawn ride to turtle conservation centre then snorkel at Hiriketiya Bay.', distance: '36 km' }
    ],
    whatToBring: ['Breathable sun sleeves', 'Reef-safe sunscreen', 'Quick-dry swimwear', 'Sandals for beach stops', 'Reusable water bottle'],
    faqs: [
      { question: 'Is this family friendly?', answer: 'Yes, we welcome confident teens 14+ and can arrange e-bikes for mixed ability groups.' },
      { question: 'Do we ride on highways?', answer: 'Routes prioritise coastal B-roads and boardwalks; busy crossings are van-supported.' }
    ],
    reviews: [
      { author: 'Tessa & Mark', role: 'Couple from Sydney', rating: 5, date: 'August 2024', content: 'Every day balanced relaxed riding with ocean dips. The guides had endless local stories.' }
    ],
    supportContacts: [
      { label: 'Trip designer', value: 'coastal@cycleparadise.lk', href: 'mailto:coastal@cycleparadise.lk' },
      { label: 'On-trip captain', value: '+94 76 441 9087', href: 'tel:+94764419087' }
    ],
    sustainability: {
      carbonOffset: 'Mangrove reforestation partnership with Ocean Guardians.',
      communityImpact: 'Stilt fishing workshops provide direct income to local artisans.',
      supportVehicle: true
    },
    duration: 4,
    difficultyLevel: 'EASY' as any,
    region: 'Southern Coast',
    basePrice: 890,
    price: 890,
    maxParticipants: 16,
    maxGroupSize: 16,
    includedServices: ['Beach cruiser or gravel bike', 'Ride leaders + lifeguard escort', '3 nights boutique hotels', 'Breakfast + seafood dinners', 'Helmet, lights, and GPS navigation'],
    excludedServices: ['Lunches', 'Alcoholic drinks', 'Optional SUP / snorkel rentals'],
    highlights: ['Stilt fishing workshops', 'Mangrove kayaking', 'Turtle conservation', 'Golden-hour fort walks'],
    images: ['/images/coastal-1.jpg', '/images/coastal-2.jpg', '/images/coastal-3.jpg'],
    mediaGallery: makeGallery(['/images/coastal-1.jpg', '/images/coastal-2.jpg', '/images/coastal-3.jpg'], 'Southern Coastal Adventure'),
    videoUrl: null,
    isActive: true,
    featured: true,
    metaTitle: 'Southern Coastal Cycling Escape - Cycle Paradise',
    metaDescription: 'Sun-splashed four-day ride hugging Sri Lanka’s south coast with seafood feasts and lagoon detours.',
    createdAt: new Date('2024-03-15T00:00:00Z'),
    updatedAt: new Date('2024-10-01T00:00:00Z')
  },
  {
    id: 'pkg_cultural_triangle',
    title: 'Cultural Triangle Expedition',
    slug: 'cultural-triangle',
    description:
      'Pedal between ancient citadels, cave temples, and wildlife-rich reservoirs across Sri Lanka’s legendary Cultural Triangle.',
    shortDescription: 'UNESCO wonders, rural rice paddies, and sunset summit hikes in North Central Sri Lanka.',
    itinerary: [
      { day: 1, title: 'Anuradhapura heritage loop', description: 'Ride among stupas and sacred bodhi trees with a resident archaeologist.', distance: '28 km' },
      { day: 2, title: 'Mihintale ridge challenge', description: 'Switchback climb rewarded with 360° views and sunset meditation.', distance: '34 km' },
      { day: 3, title: 'Sigiriya double summit', description: 'Pedal to Sigiriya Rock and optional Pidurangala sunset scramble.', distance: '40 km' },
      { day: 4, title: 'Rural reservoirs & elephants', description: 'Gravel ride skirting Minneriya National Park with jeep safari add-on.', distance: '52 km' },
      { day: 5, title: 'Polonnaruwa royal mile', description: 'Time-trial between palace ruins before farewell curry feast.', distance: '30 km' }
    ],
    whatToBring: ['Lightweight scarf for temple visits', 'Bug spray for dusk rides', 'Cash for roadside fruit stalls', 'Head torch for dawn hikes'],
    faqs: [
      { question: 'Are temple entry fees included?', answer: 'Yes, all UNESCO site permits and guiding fees are covered.' },
      { question: 'Will we see wildlife?', answer: 'Wild elephant sightings are common on Day 4; spotters and radios keep everyone safe.' }
    ],
    reviews: [
      { author: 'Kenji Ito', role: 'History teacher', rating: 5, date: 'July 2024', content: 'Combines proper riding with incredible storytelling. I filled an entire sketchbook.' }
    ],
    supportContacts: [
      { label: 'Cultural specialist', value: '+94 70 455 1288', href: 'tel:+94704551288' }
    ],
    sustainability: {
      carbonOffset: 'Carbon-neutral travel via local agro-forestry project.',
      communityImpact: 'Village lunches and craft cooperatives receive direct payments.',
      supportVehicle: true
    },
    duration: 5,
    difficultyLevel: 'CHALLENGING' as any,
    region: 'North Central',
    basePrice: 1420,
    price: 1420,
    maxParticipants: 10,
    maxGroupSize: 10,
    includedServices: ['Carbon gravel bike', 'Cultural interpretation guide', 'Support jeep + mechanic', 'Safari jeep (shared)', 'Breakfast + most lunches'],
    excludedServices: ['Evening meals', 'Bar drinks', 'Visa fees'],
    highlights: ['Sigiriya & Pidurangala', 'Mihintale climbs', 'Polonnaruwa ruins', 'Minneriya safari'],
    images: ['/images/cultural-1.jpg', '/images/cultural-2.jpg', '/images/cultural-3.jpg'],
    mediaGallery: makeGallery(['/images/cultural-1.jpg', '/images/cultural-2.jpg', '/images/cultural-3.jpg'], 'Cultural Triangle Expedition'),
    videoUrl: '9No-FiEInLA',
    isActive: true,
    featured: false,
    metaTitle: 'Cultural Triangle Expedition - Cycle Paradise',
    metaDescription: 'Five-day history-rich ride linking Sigiriya, Anuradhapura, and Polonnaruwa with expert storytellers.',
    createdAt: new Date('2024-04-10T00:00:00Z'),
    updatedAt: new Date('2024-10-01T00:00:00Z')
  }
];

export const getFallbackTourPackageBySlug = (slug: string) =>
  fallbackTourPackages.find((pkg) => pkg.slug === slug);

export const getFallbackTourPackageSlugs = () => fallbackTourPackages.map((pkg) => pkg.slug);

export const getRelatedFallbackTourPackages = (slug: string, region?: string, limit: number = 3) => {
  const pool = fallbackTourPackages.filter((pkg) => pkg.slug !== slug);
  if (region) {
    const regionMatches = pool.filter((pkg) => pkg.region === region);
    if (regionMatches.length >= limit) {
      return regionMatches.slice(0, limit);
    }
  }
  return pool.slice(0, limit);
};
