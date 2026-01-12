export interface Perfume {
  id: string;
  name: string;
  inspiration: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  price: number;
  availability: 'In Stock' | 'Out of Stock';
  isVisible: boolean;
  character: string;
  usage: string;
  longevity: string;
}

export interface BrandInfo {
  story: string;
  companyInfo: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string | undefined;
    instagram: string | undefined;
    twitter: string | undefined;
  };
}

export interface UserQueryLog {
  id: string;
  query: string;
  timestamp: number;
}

let brandInfo: BrandInfo = {
  story: "Founded on the principle of capturing ephemeral moments, FGPerfume crafts high-quality, affordable luxury scents that are both timeless and modern. Our research and development began in 2023, with the company officially registered in 2025.",
  companyInfo: "FGPerfume is a proudly Malaysian luxury fragrance house based in Selangor. All our products are developed and manufactured with a focus on quality to ensure an exquisite experience."
};

let contactInfo: ContactInfo = {
  email: "care@fgperfume.com",
  phone: "+60 12-345 6789",
  address: "123 Jalan Wangi, 47500 Subang Jaya, Selangor, Malaysia",
  socialMedia: {
    facebook: "https://facebook.com/fgperfume",
    instagram: "https://instagram.com/fgperfume",
    twitter: "https://twitter.com/fgperfume"
  }
};

let perfumes: Perfume[] = [
  {
    id: '1',
    name: 'Noir Essence',
    inspiration: 'A walk through a Malaysian rainforest at midnight.',
    topNotes: ['Bergamot', 'Pink Pepper'],
    middleNotes: ['Incense', 'Orris'],
    baseNotes: ['Vetiver', 'Patchouli', 'Vanilla'],
    price: 250,
    availability: 'In Stock',
    isVisible: true,
    character: 'Mysterious, deep, and sophisticated.',
    usage: 'Ideal for evening wear, autumn and winter seasons.',
    longevity: 'Long-lasting',
  },
  {
    id: '2',
    name: 'Solis Dream',
    inspiration: 'The warmth of the first sunbeam over the Cameron Highlands.',
    topNotes: ['Mandarin', 'Lemon', 'Grapefruit'],
    middleNotes: ['Neroli', 'Jasmine'],
    baseNotes: ['Musk', 'Amber'],
    price: 220,
    availability: 'In Stock',
    isVisible: true,
    character: 'Bright, uplifting, and radiant.',
    usage: 'Perfect for daytime, spring and summer.',
    longevity: 'Moderate',
  },
  {
    id: '3',
    name: 'Aqua Flora',
    inspiration: 'A hidden coastal garden in Langkawi after a rain shower.',
    topNotes: ['Sea Salt', 'Bergamot'],
    middleNotes: ['Lily of the Valley', 'Rose'],
    baseNotes: ['Cedarwood', 'Ambrette'],
    price: 235,
    availability: 'Out of Stock',
    isVisible: false,
    character: 'Fresh, aquatic, and subtly floral.',
    usage: 'Excellent for casual wear, especially in warm weather.',
    longevity: 'Moderate',
  },
];

let userQueries: UserQueryLog[] = [
    {id: '1', query: 'What is the most popular perfume?', timestamp: Date.now() - 100000 },
    {id: '2', query: 'Tell me about Noir Essence.', timestamp: Date.now() - 50000 },
];

export const mockDb = {
  brandInfo,
  contactInfo,
  perfumes,
  userQueries
};
