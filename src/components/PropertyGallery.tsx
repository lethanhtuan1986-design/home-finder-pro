import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] bg-muted">
      <img
        src={images[current]}
        alt={`${title} - Ảnh ${current + 1}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors text-foreground"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors text-foreground"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-foreground">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};
