import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const lightGalleryRef = useRef<any>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  const openLightbox = (index?: number) => {
    lightGalleryRef.current?.openGallery(index ?? current);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] bg-muted group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[current]}
          alt={`${title} - Ảnh ${current + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openLightbox()}
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors text-foreground"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors text-foreground"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 right-14 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-foreground">
              {current + 1} / {images.length}
            </div>
          </>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); openLightbox(); }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <LightGallery
        onInit={(ref) => { lightGalleryRef.current = ref.instance; }}
        plugins={[lgZoom, lgThumbnail]}
        speed={300}
        closeOnTap
        download={false}
        counter
        dynamic
        dynamicEl={images.map((src, i) => ({
          src,
          thumb: src,
          subHtml: `<h4>${title} - Ảnh ${i + 1}</h4>`,
        }))}
      />
    </>
  );
};
