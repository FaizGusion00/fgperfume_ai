"use server";

import mysql from 'mysql2/promise';
import { Perfume, BrandInfo, ContactInfo, mockDb } from '@/lib/mock-data';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'fgperfume',
  waitForConnections: true,
  connectionLimit: 10,
});

// Utility wrapper to fall back to mock DB on any MySQL error
async function withDb<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    // Log a concise message (avoid printing full stack) so dev logs aren't flooded
    console.warn(`MySQL store unavailable, using mock data (reason: ${err?.message || String(err)})`);
    return fallback();
  }
}

// GETTERS
export const getBrandInfo = async (): Promise<BrandInfo> => {
  return withDb(async () => {
    const [rows] = await pool.query('SELECT story, companyInfo FROM brand_info LIMIT 1');
    const r: any = (rows as any)[0];
    if (!r) return { story: '', companyInfo: '' };
    return { story: r.story || '', companyInfo: r.companyInfo || '' };
  }, () => mockDb.brandInfo);
};

export const getContactInfo = async (): Promise<ContactInfo> => {
  return withDb(async () => {
    const [rows] = await pool.query('SELECT * FROM contact_info LIMIT 1');
    const r: any = (rows as any)[0];
    if (!r) return { email: '', phone: '', address: '', socialMedia: {} };
    return {
      email: r.email || '',
      phone: r.phone || '',
      address: r.address || '',
      socialMedia: {
        facebook: r.social_facebook || undefined,
        instagram: r.social_instagram || undefined,
        twitter: r.social_twitter || undefined,
      },
    };
  }, () => mockDb.contactInfo);
};

export const getPerfumes = async (includeHidden = false): Promise<Perfume[]> => {
  return withDb(async () => {
    const [rows] = await pool.query('SELECT * FROM perfumes');
    const arr: any[] = rows as any[];
    const mapped = arr.map(r => ({
      id: r.id,
      name: r.name,
      inspiration: r.inspiration,
      topNotes: JSON.parse(r.topNotes || '[]'),
      middleNotes: JSON.parse(r.middleNotes || '[]'),
      baseNotes: JSON.parse(r.baseNotes || '[]'),
      price: Number(r.price),
      availability: r.availability,
      isVisible: !!r.isVisible,
      character: r.character,
      usage: r.usage,
      longevity: r.longevity,
    } as Perfume));
    return includeHidden ? mapped : mapped.filter(p => p.isVisible);
  }, () => includeHidden ? mockDb.perfumes : mockDb.perfumes.filter(p => p.isVisible));
};

export const getPerfumeById = async (id: string): Promise<Perfume | undefined> => {
  return withDb(async () => {
    const [rows] = await pool.query('SELECT * FROM perfumes WHERE id = ? LIMIT 1', [id]);
    const r: any = (rows as any)[0];
    if (!r) return undefined;
    return {
      id: r.id,
      name: r.name,
      inspiration: r.inspiration,
      topNotes: JSON.parse(r.topNotes || '[]'),
      middleNotes: JSON.parse(r.middleNotes || '[]'),
      baseNotes: JSON.parse(r.baseNotes || '[]'),
      price: Number(r.price),
      availability: r.availability,
      isVisible: !!r.isVisible,
      character: r.character,
      usage: r.usage,
      longevity: r.longevity,
    } as Perfume;
  }, () => mockDb.perfumes.find(p => p.id === id));
};

export const getKnowledgeBaseAsString = async (): Promise<string> => {
  const brandInfo = await getBrandInfo();
  const perfumes = await getPerfumes();
  const contactInfo = await getContactInfo();

  let knowledgeBase = `Brand Information:\n- Company: FG Universal Empire (SSM No.: 202503270156 (IP0614068-A))\n- Brand: FGPerfume\n- Founder & Developer: Faiz Nasir\n- Location: Selangor, Malaysia\n- History: Research and development started in 2023, with the company officially registered in 2025.\n- Philosophy: ${brandInfo.story}\n- About: ${brandInfo.companyInfo}\n\n`;

  knowledgeBase += `Contact Information:\n- Email: ${contactInfo.email}\n- Phone: ${contactInfo.phone}\n- Address: ${contactInfo.address}\n`;
  if (contactInfo.socialMedia.facebook) knowledgeBase += `- Facebook: ${contactInfo.socialMedia.facebook}\n`;
  if (contactInfo.socialMedia.instagram) knowledgeBase += `- Instagram: ${contactInfo.socialMedia.instagram}\n`;
  if (contactInfo.socialMedia.twitter) knowledgeBase += `- Twitter: ${contactInfo.socialMedia.twitter}\n`;
  
  knowledgeBase += `\nAvailable Perfumes:\n`;
  
  perfumes.forEach(p => {
    knowledgeBase += `\n- Name: ${p.name}\n- Inspiration: ${p.inspiration}\n- Character: ${p.character}\n- Top Notes: ${p.topNotes.join(', ')}\n- Middle Notes: ${p.middleNotes.join(', ')}\n- Base Notes: ${p.baseNotes.join(', ')}\n- Price: $${p.price}\n- Availability: ${p.availability}\n- Best Usage: ${p.usage}\n- Longevity: ${p.longevity}\n`;
  });

  // Add a machine-readable JSON block at the end that contains canonical data.
  const canonical = {
    brand: {
      story: brandInfo.story,
      companyInfo: brandInfo.companyInfo,
    },
    contact: contactInfo,
    perfumes: perfumes.map(p => ({
      id: p.id,
      name: p.name,
      inspiration: p.inspiration,
      topNotes: p.topNotes,
      middleNotes: p.middleNotes,
      baseNotes: p.baseNotes,
      price: p.price,
      availability: p.availability,
      isVisible: p.isVisible,
      character: p.character,
      usage: p.usage,
      longevity: p.longevity,
    })),
  };

  knowledgeBase += `\nData (JSON):\n` + JSON.stringify(canonical, null, 2) + `\n`;

  return knowledgeBase;
};

export const getLoggedQueries = async () => {
  return withDb(async () => {
    const [rows] = await pool.query('SELECT * FROM user_queries ORDER BY timestamp DESC');
    return (rows as any[]).map(r => ({ id: String(r.id), query: r.query, timestamp: Number(r.timestamp) }));
  }, () => mockDb.userQueries.slice().sort((a, b) => b.timestamp - a.timestamp));
};

// SETTERS / MUTATIONS
export const saveUserQuery = async (query: string, timestamp: number): Promise<void> => {
  return withDb(async () => {
    await pool.query('INSERT INTO user_queries (query, timestamp) VALUES (?, ?)', [query, timestamp]);
  }, () => {
    mockDb.userQueries.push({ id: String(mockDb.userQueries.length + 1), query, timestamp });
    return undefined as any;
  });
};

export const updateBrandInfo = async (data: BrandInfo): Promise<BrandInfo> => {
  return withDb(async () => {
    await pool.query('INSERT INTO brand_info (id, story, companyInfo) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE story=VALUES(story), companyInfo=VALUES(companyInfo)', [data.story, data.companyInfo]);
    return data;
  }, () => {
    mockDb.brandInfo = { ...mockDb.brandInfo, ...data };
    return mockDb.brandInfo;
  });
};

export const updateContactInfo = async (data: ContactInfo): Promise<ContactInfo> => {
  return withDb(async () => {
    await pool.query(
      'INSERT INTO contact_info (id, email, phone, address, social_facebook, social_instagram, social_twitter) VALUES (1,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE email=VALUES(email), phone=VALUES(phone), address=VALUES(address), social_facebook=VALUES(social_facebook), social_instagram=VALUES(social_instagram), social_twitter=VALUES(social_twitter)'
      , [data.email, data.phone, data.address, data.socialMedia.facebook || null, data.socialMedia.instagram || null, data.socialMedia.twitter || null]
    );
    return data;
  }, () => {
    mockDb.contactInfo = { ...mockDb.contactInfo, ...data };
    return mockDb.contactInfo;
  });
};

export const addPerfume = async (perfumeData: Omit<Perfume, 'id'>): Promise<Perfume> => {
  const id = String(Date.now());
  return withDb(async () => {
    await pool.query('INSERT INTO perfumes (id, name, inspiration, topNotes, middleNotes, baseNotes, price, availability, isVisible, `character`, `usage`, longevity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [
      id,
      perfumeData.name,
      perfumeData.inspiration,
      JSON.stringify(perfumeData.topNotes || []),
      JSON.stringify(perfumeData.middleNotes || []),
      JSON.stringify(perfumeData.baseNotes || []),
      perfumeData.price,
      perfumeData.availability,
      perfumeData.isVisible ? 1 : 0,
      perfumeData.character,
      perfumeData.usage,
      perfumeData.longevity,
    ]);
    return { id, ...perfumeData } as Perfume;
  }, () => {
    const newPerfume = { id, ...perfumeData } as Perfume;
    mockDb.perfumes.push(newPerfume);
    return newPerfume;
  });
};

export const updatePerfume = async (id: string, data: Partial<Perfume>): Promise<Perfume | null> => {
  return withDb(async () => {
    const existing = await getPerfumeById(id);
    if (!existing) return null;
    const merged = { ...existing, ...data } as Perfume;
    await pool.query('UPDATE perfumes SET name=?, inspiration=?, topNotes=?, middleNotes=?, baseNotes=?, price=?, availability=?, isVisible=?, `character`=?, `usage`=?, longevity=? WHERE id=?', [
      merged.name,
      merged.inspiration,
      JSON.stringify(merged.topNotes || []),
      JSON.stringify(merged.middleNotes || []),
      JSON.stringify(merged.baseNotes || []),
      merged.price,
      merged.availability,
      merged.isVisible ? 1 : 0,
      merged.character,
      merged.usage,
      merged.longevity,
      id,
    ]);
    return merged;
  }, () => {
    const idx = mockDb.perfumes.findIndex(p => p.id === id);
    if (idx === -1) return null;
    mockDb.perfumes[idx] = { ...mockDb.perfumes[idx], ...data } as Perfume;
    return mockDb.perfumes[idx];
  });
};

export const deletePerfume = async (id: string): Promise<boolean> => {
  return withDb(async () => {
    const [res] = await pool.query('DELETE FROM perfumes WHERE id=?', [id]);
    const info: any = res;
    return info.affectedRows > 0;
  }, () => {
    const idx = mockDb.perfumes.findIndex(p => p.id === id);
    if (idx === -1) return false;
    mockDb.perfumes.splice(idx, 1);
    return true;
  });
};
