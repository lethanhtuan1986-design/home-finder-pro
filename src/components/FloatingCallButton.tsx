import { Phone } from 'lucide-react';

const HOTLINE = '1900123456'; // XanhStay hotline

export const FloatingCallButton = () => {
  return (
    <a
      href={`tel:${HOTLINE}`}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform animate-pulse-slow md:bottom-8 md:right-8"
      aria-label="Gọi tư vấn"
      title="Gọi tư vấn"
    >
      <Phone size={24} />
    </a>
  );
};
