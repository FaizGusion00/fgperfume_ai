import { getBrandInfo } from "@/services/firebase/store";
import { BrandForm } from "@/components/admin/brand-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function BrandPage() {
  const brandInfo = await getBrandInfo();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Manage Brand Information</h1>
      <Card>
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
          <CardDescription>
            Update the story and company information that defines FGPerfume. This content will be used by the AI Concierge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BrandForm initialData={brandInfo} />
        </CardContent>
      </Card>
    </div>
  );
}
