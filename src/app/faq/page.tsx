import type { Metadata } from 'next';
import { FaqSection } from '@/components/home/faq-section';

export const metadata: Metadata = { title: 'FAQ — SocialBoost' };

export default function FaqPage() {
  return (
    <div className="py-6">
      <FaqSection />
    </div>
  );
}
