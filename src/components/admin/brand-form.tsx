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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { BrandInfo } from '@/lib/mock-data';
import { updateBrandInfoAction } from '@/app/admin/actions';
import { useTransition } from 'react';

const brandInfoSchema = z.object({
  story: z.string().min(1, 'Brand story is required'),
  companyInfo: z.string().min(1, 'Company information is required'),
});

type BrandInfoFormValues = z.infer<typeof brandInfoSchema>;

interface BrandFormProps {
  initialData: BrandInfo;
}

export function BrandForm({ initialData }: BrandFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BrandInfoFormValues>({
    resolver: zodResolver(brandInfoSchema),
    defaultValues: initialData,
  });

  function onSubmit(data: BrandInfoFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('story', data.story);
      formData.append('companyInfo', data.companyInfo);

      const result = await updateBrandInfoAction(formData);

      if (result.success) {
        toast({ title: 'Brand information updated successfully.' });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update brand information.',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="story"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Story</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="Our philosophy is one of minimalist luxury..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Information</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="FGPerfume is a privately owned luxury fragrance house..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
