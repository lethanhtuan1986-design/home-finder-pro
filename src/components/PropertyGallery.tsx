import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, prev, next]);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] bg-muted group">
        <img
          src={images[current]}
          alt={`${title} - Ảnh ${current + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setLightboxOpen(true)}
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
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100dvh] w-screen h-[100dvh] p-0 border-none bg-black/95 backdrop-blur-sm [&>button]:hidden">
          <DialogTitle className="sr-only">Gallery</DialogTitle>

          {/* Close button - always visible, prominent */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 active:bg-white/40 transition-colors text-white font-medium text-sm"
            aria-label="Đóng"
          >
            <X size={18} />
            <span>Đóng</span>
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-50 bg-black/40 backdrop-blur-md text-white text-sm font-medium px-3 py-1.5 rounded-full">
              {current + 1} / {images.length}
            </div>
          )}

          {/* Image - responsive padding */}
          <div className="flex items-center justify-center w-full h-full p-4 sm:p-8 md:p-12 lg:p-16 pt-16 sm:pt-16">
            <img
              src={images[current]}
              alt={`${title} - Ảnh ${current + 1}`}
              className="max-w-full max-h-[calc(100dvh-8rem)] sm:max-h-[calc(100dvh-6rem)] object-contain select-none rounded-lg"
            />
          </div>

          {/* Nav buttons - responsive sizing */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors text-white"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors text-white"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
