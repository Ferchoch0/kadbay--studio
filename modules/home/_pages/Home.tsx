import Navbar from '../_components/navbar/Navbar';
import Hero from '../_components/hero/Hero';
import AboutUs from '../_components/about-us/AboutUs';
import OurServices from '../_components/our-services/OurServices';
import Contact from '../_components/contact/Contact';
import Footer from '../_components/footer/Footer';
import { SeparatorA } from '../_components/separator/Separator';
import { SeparatorB } from '../_components/separator/Separator';


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <OurServices />
      <SeparatorA />
      <AboutUs />
      <SeparatorB />
      <Contact />
      <Footer />
    </main>
  );
}
