import { Hero } from '@/components/home/hero';
import { LiveTicker } from '@/components/home/live-ticker';
import { PlatformsGrid } from '@/components/home/platforms-grid';
import { HowItWorks } from '@/components/home/how-it-works';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { FaqSection } from '@/components/home/faq-section';
import { CtaSection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <PlatformsGrid />
      <HowItWorks />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
