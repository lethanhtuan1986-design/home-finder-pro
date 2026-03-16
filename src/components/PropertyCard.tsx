import { Link } from 'react-router-dom';
import { MapPin, Maximize, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Property, formatPrice } from '@/lib/mock-data';
import { useSavedRooms } from '@/hooks/useSavedRooms';

interface PropertyCardProps {
  data: Property;
  index?: number;
}

export const PropertyCard = ({ data, index = 0 }: PropertyCardProps) => {
  const { isSaved, toggleSave } = useSavedRooms();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to={`/property/${data.id}`} className="block">
        <div className="bg-card rounded-2xl overflow-hidden border border-border card-hover">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={data.images[0]}
              alt={data.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSave(data.id); }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center transition-colors hover:bg-card"
            >
              <Heart
                size={18}
                className={isSaved(data.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}
              />
            </button>
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-foreground">
              {data.type}
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate text-sm">{data.title}</h3>
            </div>
            <p className="price-display text-lg mb-1">{formatPrice(data.price)}/tháng</p>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
              <MapPin size={14} /> {data.ward}, {data.district}
            </p>
            <div className="flex gap-4 border-t border-border pt-3 text-muted-foreground text-xs">
              <span className="flex items-center gap-1"><Maximize size={14} /> {data.size}m²</span>
              <span className="flex items-center gap-1"><Users size={14} /> {data.capacity} người</span>
              {data.distance && (
                <span className="hidden sm:flex items-center gap-1 ml-auto text-muted-foreground">
                  {data.distance}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
