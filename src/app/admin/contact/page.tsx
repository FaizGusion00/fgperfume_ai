import { getContactInfo } from "@/services/firebase/store";
import { ContactForm } from "@/components/admin/contact-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Manage Contact Information</h1>
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Update your customer-facing contact and social media information. This will be used by the AI Concierge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm initialData={contactInfo} />
        </CardContent>
      </Card>
    </div>
  );
}
