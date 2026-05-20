// Mock data for Bagdrop booking clone

export const LOGO_URL = "https://customer-assets.emergentagent.com/job_bagdrop-metro/artifacts/0ct8bpim_Bagdrop-Draft-3-1l.png";

export const SERVICE_CATEGORIES = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'after-hours', label: 'After Hours' },
];

export const SERVICES = [
  {
    id: 'address-to-address',
    category: 'scheduled',
    title: 'Door-to-Door',
    subtitle: 'Pickup from your home, delivered to any address',
    hours: '8AM - 8PM',
    badge: null,
    color: 'orange',
    icon: 'MapPinned',
    description: 'We pick up your bags from your home/hotel and deliver them to any address in India.'
  },
  {
    id: 'airport-delivery',
    category: 'scheduled',
    title: 'Airport Express',
    subtitle: 'Direct delivery to airport check-in',
    hours: '8 AM – 6 PM',
    badge: 'POPULAR',
    color: 'orange',
    icon: 'Plane',
    description: 'Skip the airport queues. We deliver your bags directly to airport check-in counters.'
  },
  {
    id: 'hotel-to-hotel',
    category: 'scheduled',
    title: 'Hotel Hop',
    subtitle: 'City-to-city luggage between hotels',
    hours: '10AM - 6PM',
    badge: 'NEW',
    color: 'pink',
    icon: 'Luggage',
    description: 'Travelling between cities? We transfer your bags directly hotel to hotel.'
  },
  {
    id: 'after-hour-airport',
    category: 'after-hours',
    title: 'Night Flight Drop',
    subtitle: 'Late-evening luggage to airports',
    hours: '6:30 PM – 8 PM',
    badge: 'NEW',
    color: 'purple',
    icon: 'Moon',
    description: 'Red-eye flight? We handle late evening luggage drops at major airports.'
  },
  {
    id: 'self-collect',
    category: 'after-hours',
    title: 'Pickup Point',
    subtitle: 'Self-collect from secure partner location',
    hours: 'Available 24/7',
    badge: null,
    color: 'green',
    icon: 'Building2',
    description: 'Collect your bags at your convenience from our secure partner location.'
  }
];

export const LOCATIONS = [
  { id: 'bom', city: 'Mumbai', label: 'Mumbai - T2 Terminal (CSMIA)', type: 'airport' },
  { id: 'del', city: 'Delhi', label: 'Delhi - IGI Airport', type: 'airport' },
  { id: 'amd', city: 'Ahmedabad', label: 'Ahmedabad - SVPI Airport', type: 'airport' },
  { id: 'bdq', city: 'Vadodara', label: 'Vadodara - Civil Airport', type: 'airport' },
  { id: 'goi', city: 'Goa', label: 'Goa - Dabolim / Mopa Airport', type: 'airport' },
  { id: 'bom-city', city: 'Mumbai', label: 'Mumbai City (Any address)', type: 'city' },
  { id: 'del-city', city: 'Delhi NCR', label: 'Delhi NCR (Any address)', type: 'city' },
  { id: 'amd-city', city: 'Ahmedabad', label: 'Ahmedabad City (Any address)', type: 'city' },
  { id: 'bdq-city', city: 'Vadodara', label: 'Vadodara City (Any address)', type: 'city' },
  { id: 'goi-city', city: 'Goa', label: 'Goa (North & South - Any address)', type: 'city' },
];

export const BAG_TYPES = [
  { id: 'travel', name: 'Travel Bag', dim: 'Standard travel bag / suitcase', weight: 'up to 23kg', price: 899 },
];

// Backwards compat alias (unused going forward)
export const BAG_SIZES = BAG_TYPES;

export const ONBOARDING_SLIDES = [
  {
    icon: 'Truck',
    color: 'orange',
    title: 'Travel Light',
    tagline: "We'll Handle the Rest",
    description: 'Address-to-address luggage collection and delivery. Focus on your journey while we take care of your bags.'
  },
  {
    icon: 'ShieldCheck',
    color: 'green',
    title: 'Safe & Secure',
    tagline: 'Your bags are in good hands',
    description: 'Every bag is tracked in real-time and insured. Rest easy knowing your belongings are protected.'
  },
  {
    icon: 'Clock',
    color: 'blue',
    title: 'Fast & On-time',
    tagline: 'Built for tight schedules',
    description: 'Same-day pickup and timely delivery across Mumbai, Delhi, Ahmedabad, Vadodara and Goa.'
  },
  {
    icon: 'MapPin',
    color: 'purple',
    title: 'Door-to-Door',
    tagline: 'From your doorstep, anywhere',
    description: 'Home to airport, hotel to hotel, or city to city — we cover the route so you don\'t have to.'
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 'BD24310',
    service: 'Airport Delivery',
    color: 'blue',
    from: 'Bandra West, Mumbai',
    to: 'Mumbai T2 - CSMIA',
    date: '2026-05-14',
    time: '11:30',
    status: 'In Transit',
    bags: 2,
    price: 1798
  },
  {
    id: 'BD24287',
    service: 'Address-to-Address',
    color: 'orange',
    from: 'Alkapuri, Vadodara',
    to: 'Bandra, Mumbai',
    date: '2026-05-09',
    time: '09:00',
    status: 'Delivered',
    bags: 3,
    price: 2697
  },
  {
    id: 'BD24201',
    service: 'Hotel-to-Hotel Transfer',
    color: 'pink',
    from: 'The Lalit, Goa',
    to: 'Taj Mahal Palace, Mumbai',
    date: '2026-04-28',
    time: '12:00',
    status: 'Delivered',
    bags: 1,
    price: 899
  }
];

export const USER = {
  name: 'Aarav Sharma',
  phone: '+91 98XXXXXX21',
  email: 'aarav.sharma@example.com',
  member_since: 'March 2025',
  total_bookings: 12
};
