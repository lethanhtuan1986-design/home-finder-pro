import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import useEmblaCarousel from 'embla-carousel-react';

// LightGallery CSS
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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const openLightbox = (index?: number) => {
    lightGalleryRef.current?.openGallery(index ?? current);
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] bg-muted group">
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex w-full h-full">
            {images.map((img, idx) => (
              <div key={idx} className="flex-[0_0_100%] min-w-0 w-full h-full">
                <img
                  src={img}
                  alt={`${title} - Ảnh ${idx + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(idx)}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
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

      {/* LightGallery - hidden trigger elements */}
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
