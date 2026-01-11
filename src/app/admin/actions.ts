'use server';

import { revalidatePath } from 'next/cache';
import { addPerfume, updatePerfume, deletePerfume, updateBrandInfo } from '@/services/firebase/store';
import { z } from 'zod';
import type { BrandInfo, Perfume } from '@/lib/mock-data';

// --- Auth Action ---
export async function loginAction(password: string) {
  if (password === 'fgperfumeuniversalempire00@') {
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
}

// --- Perfume Actions ---

const perfumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  inspiration: z.string().min(1, "Inspiration is required"),
  character: z.string().min(1, "Character is required"),
  usage: z.string().min(1, "Usage is required"),
  longevity: z.string().min(1, "Longevity is required"),
  topNotes: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  middleNotes: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  baseNotes: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  price: z.coerce.number().min(0, "Price must be positive"),
  availability: z.enum(['In Stock', 'Out of Stock']),
  isVisible: z.boolean(),
});

export async function addPerfumeAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = perfumeSchema.safeParse({
    ...data,
    isVisible: data.isVisible === 'on',
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  await addPerfume(parsed.data as Omit<Perfume, 'id'>);
  revalidatePath('/admin/perfumes');
  revalidatePath('/');
  return { success: true };
}

export async function updatePerfumeAction(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = perfumeSchema.safeParse({
    ...data,
    isVisible: data.isVisible === 'on',
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  await updatePerfume(id, parsed.data);
  revalidatePath('/admin/perfumes');
  revalidatePath('/');
  return { success: true };
}

export async function deletePerfumeAction(id: string) {
  await deletePerfume(id);
  revalidatePath('/admin/perfumes');
  revalidatePath('/');
}

// --- Brand Info Actions ---

const brandInfoSchema = z.object({
    story: z.string().min(1, "Story is required"),
    companyInfo: z.string().min(1, "Company info is required"),
});

export async function updateBrandInfoAction(formData: FormData) {
    const data = Object.fromEntries(formData);
    const parsed = brandInfoSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    await updateBrandInfo(parsed.data as BrandInfo);
    revalidatePath('/admin/brand');
    revalidatePath('/');
    return { success: true };
}
