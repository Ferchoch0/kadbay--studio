import Navbar from '../_components/navbar/Navbar';
import Hero from '../_components/hero/Hero';
import AboutUs from '../_components/about-us/AboutUs';
import OurServices from '../_components/our-services/OurServices';
import Contact from '../_components/contact/Contact';
import Footer from '../_components/footer/Footer';
import { SeparatorA, SeparatorB } from '../_components/separator/Separator';
import { businessService } from '@/services/business.service';

export default async function Home() {
  const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'kadbay';
  const business = await businessService.getBySlug(slug).catch(async (error) => {
    console.error(`Error fetching business by slug (${slug}):`, error);
    return businessService.getPrimary().catch(() => null);
  });

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero business={business} />
      <OurServices />
      <SeparatorA business={business} />
      <AboutUs business={business} />
      <SeparatorB />
      <Contact business={business} />
      <Footer business={business} />
    </main>
  );
}
