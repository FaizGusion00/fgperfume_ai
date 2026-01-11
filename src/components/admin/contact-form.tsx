'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { ContactInfo } from '@/lib/mock-data';
import { updateContactInfoAction } from '@/app/admin/actions';
import { useTransition } from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  facebook: z.string().url("Invalid URL").optional().or(z.literal('')),
  instagram: z.string().url("Invalid URL").optional().or(z.literal('')),
  twitter: z.string().url("Invalid URL").optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactInfoSchema>;

interface ContactFormProps {
  initialData: ContactInfo;
}

export function ContactForm({ initialData }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        facebook: initialData.socialMedia.facebook || '',
        instagram: initialData.socialMedia.instagram || '',
        twitter: initialData.socialMedia.twitter || '',
    },
  });

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('facebook', data.facebook || '');
      formData.append('instagram', data.instagram || '');
      formData.append('twitter', data.twitter || '');

      const result = await updateContactInfoAction(formData);

      if (result.success) {
        toast({ title: 'Contact information updated successfully.' });
        router.refresh();
      } else {
        console.error(result.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update contact information. Check console for details.',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                    <Input placeholder="care@fgperfume.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                    <Input placeholder="+60 12-345 6789" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="123 Jalan Wangi, 47500 Subang Jaya, Selangor, Malaysia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <h3 className="text-lg font-medium pt-4">Social Media Links</h3>
        <div className="space-y-4">
             <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://facebook.com/fgperfume" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://instagram.com/fgperfume" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter/X URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://twitter.com/fgperfume" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
