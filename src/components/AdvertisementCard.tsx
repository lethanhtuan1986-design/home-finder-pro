import { Link } from 'react-router-dom';
import { MapPin, Maximize, Star, Heart, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AdvertisementData } from '@/services/advertisement.service';
import { formatVNPrice, getImageUrl } from '@/services/index';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import { toast } from 'sonner';

interface AdvertisementCardProps {
  data: AdvertisementData;
  index?: number;
}

export const AdvertisementCard = ({ data, index = 0 }: AdvertisementCardProps) => {
  const { isSaved, toggleSave } = useSavedRooms();
  const { t } = useTranslation();
  const apt = data?.apartmentUu;
  const firstImage = data?.images?.[0];
  const imageUrl = firstImage ? getImageUrl(firstImage) : '/placeholder.svg';

  const locationText =
    apt?.ward?.fullName || apt?.province?.fullName
      ? [apt?.ward?.fullName, apt?.province?.fullName].filter(Boolean).join(', ')
      : 'Đang cập nhật';

  const typeName = apt?.apartmentTypeUu?.name || t('listing.room');
  const apartmentSize = apt?.apartmentSize;
  const roomCount = apt?.roomCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to={`/property/${data?.uuid}`} className="block">
        <div className="bg-card rounded-2xl overflow-hidden border border-border card-hover">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt={data?.title || ''}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSave(data?.uuid); }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center transition-colors hover:bg-card"
            >
              <Heart
                size={18}
                className={isSaved(data?.uuid) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}
              />
            </button>
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-foreground">
              {typeName}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-foreground text-sm truncate mb-1" title={data?.title || ''}>
              {data?.title || 'Đang cập nhật'}
            </h3>
            <p className="price-display text-lg mb-1">{formatVNPrice(data?.price ?? 0)}{t('listing.perMonth')}</p>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-1">
              <MapPin size={14} />
              <span className="truncate">{locationText}</span>
            </p>
            {apt?.address && (
              <p className="text-muted-foreground text-xs truncate mb-3">{apt.address}</p>
            )}
            <div className="flex gap-4 border-t border-border pt-3 text-muted-foreground text-xs">
              {apartmentSize != null && apartmentSize > 0 && (
                <span className="flex items-center gap-1">
                  <Maximize size={14} /> {apartmentSize}m²
                </span>
              )}
              {roomCount != null && roomCount > 0 && (
                <span className="flex items-center gap-1">
                  <Building size={14} /> {roomCount} {t('listing.rooms')}
                </span>
              )}
              {apt?.avgStars != null && apt.avgStars > 0 && (
                <span className="flex items-center gap-1 ml-auto">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  {apt.avgStars}
                </span>
              )}
            </div>
            {data?.deposit != null && data.deposit > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {t('listing.deposit')}: {formatVNPrice(data.deposit)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
