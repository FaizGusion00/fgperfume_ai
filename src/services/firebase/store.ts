'use server';

import { mockDb, type Perfume, type BrandInfo } from '@/lib/mock-data';

// This is a mock store that simulates Firestore.
// In a real application, you would replace this with actual Firebase SDK calls.

// GETTERS
export const getBrandInfo = async (): Promise<BrandInfo> => {
  return Promise.resolve(mockDb.brandInfo);
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

  let knowledgeBase = `Brand Story: ${brandInfo.story}\nCompany Information: ${brandInfo.companyInfo}\n\nAvailable Perfumes:\n`;
  
  perfumes.forEach(p => {
    knowledgeBase += `
- Name: ${p.name}
- Inspiration: ${p.inspiration}
- Character: ${p.character}
- Top Notes: ${p.topNotes.join(', ')}
- Middle Notes: ${p.middleNotes.join(', ')}
- Base Notes: ${p.baseNotes.join(', ')}
- Price: $${p.price}
- Availability: ${p.availability}
- Best Usage: ${p.usage}
- Longevity: ${p.longevity}
\n`;
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
