import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';
import { VendorProfileScreen } from '@/modules/vendors/user';
import { demoVendors } from '@/demo/vendors';

interface VendorProfilePageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

export default async function VendorProfilePage({ params }: VendorProfilePageProps) {
  // Await params in Next.js 16
  const { vendorId } = await params;
  
  // Find vendor by ID
  const vendor = demoVendors.find((v) => v.id === vendorId);

  // If vendor not found, show 404
  if (!vendor) {
    notFound();
  }

  return (
    <GradientBackground>
      <Header variant="glassmorphic" />
      <VendorProfileScreen vendor={vendor} />
      <Footer />
    </GradientBackground>
  );
}