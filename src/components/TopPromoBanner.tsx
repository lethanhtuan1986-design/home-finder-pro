import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Megaphone } from 'lucide-react';

const promoMessages = [
  "🎉 Ưu đãi đặc biệt: Thanh toán trước 6 tháng giảm 3%, 12 tháng giảm 5%!",
  "📱 Tải app XanhStay để nhận thông báo phòng mới ngay lập tức!",
  "🏠 Đăng phòng miễn phí trên XanhStay — Tiếp cận hàng nghìn người thuê!",
];

interface TopPromoBannerProps {
  onHeightChange?: (height: number) => void;
}

export const TopPromoBanner = ({ onHeightChange }: TopPromoBannerProps) => {
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Auto-rotate messages
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visible]);

  // Report height changes
  useEffect(() => {
    if (!visible) {
      onHeightChange?.(0);
      return;
    }
    if (ref.current) {
      onHeightChange?.(ref.current.getBoundingClientRect().height);
    }
  }, [visible, onHeightChange]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="bg-primary text-primary-foreground text-xs sm:text-sm relative z-[60]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 py-2">
        <Megaphone size={14} className="shrink-0 opacity-80" />
        <p className="text-center font-medium truncate">
          {promoMessages[currentIndex]}
        </p>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 ml-2 p-0.5 rounded hover:bg-primary-foreground/20 transition-colors"
          aria-label="Đóng"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
