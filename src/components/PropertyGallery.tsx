import { useState, useCallback } from 'react';
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

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] bg-muted group">
        <img
          src={images[current]}
          alt={`${title} - Ảnh ${current + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onDoubleClick={() => setLightboxOpen(true)}
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
            <div className="absolute bottom-3 right-14 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-foreground">
              {current + 1} / {images.length}
            </div>
          </>
        )}
        {/* Fullscreen button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-none bg-black/95 backdrop-blur-sm [&>button]:hidden">
          <DialogTitle className="sr-only">Gallery</DialogTitle>
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 z-50 text-white/80 text-sm font-medium">
              {current + 1} / {images.length}
            </div>
          )}

          {/* Image */}
          <div className="flex items-center justify-center w-full h-full p-8 md:p-16">
            <img
              src={images[current]}
              alt={`${title} - Ảnh ${current + 1}`}
              className="max-w-full max-h-full object-contain select-none"
            />
          </div>

          {/* Nav buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors text-white"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
