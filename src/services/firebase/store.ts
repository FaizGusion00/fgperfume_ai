'use server';

import { mockDb, type Perfume, type BrandInfo, type ContactInfo } from '@/lib/mock-data';

// This is a mock store that simulates Firestore.
// In a real application, you would replace this with actual Firebase SDK calls.

// GETTERS
export const getBrandInfo = async (): Promise<BrandInfo> => {
  return Promise.resolve(mockDb.brandInfo);
};

export const getContactInfo = async (): Promise<ContactInfo> => {
  return Promise.resolve(mockDb.contactInfo);
};

export const getPerfumes = async (includeHidden = false): Promise<Perfume[]> => {
  if (includeHidden) {
    return Promise.resolve(mockDb.perfumes);
  }
  return Promise.resolve(mockDb.perfumes.filter(p => p.isVisible));
};

export const getPerfumeById = async (id: string): Promise<Perfume | undefined> => {
  return Promise.resolve(mockDb.perfumes.find(p => p.id === id));
};

export const getKnowledgeBaseAsString = async (): Promise<string> => {
  const brandInfo = await getBrandInfo();
  const perfumes = await getPerfumes();
  const contactInfo = await getContactInfo();

  const formatMYR = (amount: number) =>
    new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);

  // Build knowledge base purely from stored data; avoid embedding hardcoded company details.
  let knowledgeBase = `Brand Information:\n`;
  if (brandInfo.story) knowledgeBase += `- Philosophy: ${brandInfo.story}\n`;
  if (brandInfo.companyInfo) knowledgeBase += `- About: ${brandInfo.companyInfo}\n`;

  knowledgeBase += `\nContact Information:\n`;
  if (contactInfo.email) knowledgeBase += `- Email: ${contactInfo.email}\n`;
  if (contactInfo.phone) knowledgeBase += `- Phone: ${contactInfo.phone}\n`;
  if (contactInfo.address) knowledgeBase += `- Address: ${contactInfo.address}\n`;
  if (contactInfo.socialMedia.facebook) knowledgeBase += `- Facebook: ${contactInfo.socialMedia.facebook}\n`;
  if (contactInfo.socialMedia.instagram) knowledgeBase += `- Instagram: ${contactInfo.socialMedia.instagram}\n`;
  if (contactInfo.socialMedia.twitter) knowledgeBase += `- Twitter: ${contactInfo.socialMedia.twitter}\n`;

  knowledgeBase += `\nAvailable Perfumes:\n`;
  perfumes.forEach(p => {
    knowledgeBase += `\n- Name: ${p.name}\n`;
    if (p.inspiration) knowledgeBase += `- Inspiration: ${p.inspiration}\n`;
    if (p.character) knowledgeBase += `- Character: ${p.character}\n`;
    if (p.topNotes?.length) knowledgeBase += `- Top Notes: ${p.topNotes.join(', ')}\n`;
    if (p.middleNotes?.length) knowledgeBase += `- Middle Notes: ${p.middleNotes.join(', ')}\n`;
    if (p.baseNotes?.length) knowledgeBase += `- Base Notes: ${p.baseNotes.join(', ')}\n`;
    if (p.price != null) knowledgeBase += `- Price: ${formatMYR(p.price)}\n`;
    if (p.availability) knowledgeBase += `- Availability: ${p.availability}\n`;
    if (p.usage) knowledgeBase += `- Best Usage: ${p.usage}\n`;
    if (p.longevity) knowledgeBase += `- Longevity: ${p.longevity}\n`;
  });

  return knowledgeBase;
};

export const getLoggedQueries = async () => {
  return Promise.resolve(mockDb.userQueries.sort((a, b) => b.timestamp - a.timestamp));
};

// SETTERS / MUTATIONS
export const saveUserQuery = async (query: string, timestamp: number): Promise<void> => {
  mockDb.userQueries.push({ id: String(mockDb.userQueries.length + 1), query, timestamp });
  return Promise.resolve();
};

export const updateBrandInfo = async (data: BrandInfo): Promise<BrandInfo> => {
  mockDb.brandInfo = { ...mockDb.brandInfo, ...data };
  return Promise.resolve(mockDb.brandInfo);
};

export const updateContactInfo = async (data: ContactInfo): Promise<ContactInfo> => {
  mockDb.contactInfo = { ...mockDb.contactInfo, ...data };
  return Promise.resolve(mockDb.contactInfo);
};

export const addPerfume = async (perfumeData: Omit<Perfume, 'id'>): Promise<Perfume> => {
  const newPerfume: Perfume = {
    ...perfumeData,
    id: String(mockDb.perfumes.length + 1),
  };
  mockDb.perfumes.push(newPerfume);
  return Promise.resolve(newPerfume);
};

export const updatePerfume = async (id: string, data: Partial<Perfume>): Promise<Perfume | null> => {
  const index = mockDb.perfumes.findIndex(p => p.id === id);
  if (index !== -1) {
    mockDb.perfumes[index] = { ...mockDb.perfumes[index], ...data };
    return Promise.resolve(mockDb.perfumes[index]);
  }
  return Promise.resolve(null);
};

export const deletePerfume = async (id: string): Promise<boolean> => {
  const index = mockDb.perfumes.findIndex(p => p.id === id);
  if (index !== -1) {
    mockDb.perfumes.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};
