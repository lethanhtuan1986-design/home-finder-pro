import { Phone } from 'lucide-react';

const HOTLINE = '19001234'; // Số hotline XanhStay

export const FloatingCallButton = () => {
  return (
    <a
      href={`tel:${HOTLINE}`}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 animate-pulse hover:animate-none"
      aria-label="Gọi hotline"
    >
      <Phone size={24} />
    </a>
  );
};
