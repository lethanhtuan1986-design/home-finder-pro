import { useState, useEffect, useRef } from 'react';
import { X, Megaphone } from 'lucide-react';

const promoMessages = [
  "🎉 Ưu đãi đặc biệt: Thanh toán trước 6 tháng giảm 3%, 12 tháng giảm 5%!",
  "📱 Tải app XanhStay để nhận thông báo phòng mới ngay lập tức!",
  "🏠 Đăng phòng miễn phí trên XanhStay — Tiếp cận hàng nghìn người thuê!",
];

export const TopPromoBanner = () => {
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Rotate messages
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visible]);

  // Set CSS variable for banner height so Navbar can offset itself
  useEffect(() => {
    const update = () => {
      const h = visible && ref.current ? ref.current.offsetHeight : 0;
      document.documentElement.style.setProperty('--promo-banner-height', `${h}px`);
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      document.documentElement.style.setProperty('--promo-banner-height', '0px');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground text-xs sm:text-sm"
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
