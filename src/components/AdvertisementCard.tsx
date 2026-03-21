import { Link } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AdvertisementData } from "@/services/advertisement.service";
import { formatVNPrice, getImageUrl } from "@/services/index";
import { useSavedRooms } from "@/hooks/useSavedRooms";
import { toast } from "sonner";

interface AdvertisementCardProps {
  data: AdvertisementData;
  index?: number;
}

export const AdvertisementCard = ({ data, index = 0 }: AdvertisementCardProps) => {
  const { isSaved, toggleSave } = useSavedRooms();
  const { t } = useTranslation();
  const apt = data?.apartmentUu;
  const firstImage = data?.images?.[0];
  const imageUrl = firstImage ? getImageUrl(firstImage) : "/placeholder.svg";

  // Compact location: Ward - Province
  const locationParts = [apt?.ward?.fullName, apt?.province?.fullName].filter(Boolean);
  const locationText = locationParts.length > 0 ? locationParts.join(", ") : "Đang cập nhật";

  const typeName = apt?.apartmentTypeUu?.name || t("listing.room");
  const apartmentSize = apt?.apartmentSize;
  const roomCount = apt?.roomCount;

  // Build compact stats line: "25m² • 2 phòng"
  const statsParts: string[] = [];
  if (apartmentSize != null && apartmentSize > 0) statsParts.push(`${apartmentSize}m²`);
  if (roomCount != null && roomCount > 0) statsParts.push(`${roomCount} ${t("listing.rooms")}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to={`/advertisement/${data?.uuid}`} className="block overflow-hidden">
        <div className="bg-card rounded-2xl overflow-hidden border border-border card-hover">
          {/* Image with floating price badge */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt={data?.title || ""}
              className="block object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 will-change-transform"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {/* Save button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const wasSaved = isSaved(data?.uuid);
                toggleSave(data?.uuid);
                toast(wasSaved ? "Đã bỏ lưu phòng" : "Đã lưu phòng thành công!", { duration: 2000 });
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center transition-colors hover:bg-card"
            >
              <Heart
                size={18}
                className={isSaved(data?.uuid) ? "fill-destructive text-destructive" : "text-muted-foreground"}
              />
            </button>
            {/* Type badge */}
            <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-foreground">
              {typeName}
            </div>
            {/* Floating price badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-4">
              <span className="text-white font-bold text-lg drop-shadow-sm">
                {formatVNPrice(data?.price ?? 0)}
                <span className="text-white/80 text-sm font-normal">{t("listing.perMonth")}</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground text-sm truncate" title={data?.title || ""}>
              {data?.title || "Đang cập nhật"}
            </h3>

            {/* Location - single line */}
            <p className="text-muted-foreground text-sm flex items-center gap-1.5">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span className="truncate">{locationText}</span>
            </p>

            {/* Stats footer with separator dots */}
            {statsParts.length > 0 && (
              <div className="bg-secondary rounded-lg px-3 py-2 text-xs text-muted-foreground font-medium">
                {statsParts.join(" • ")}
                {apt?.avgStars != null && apt.avgStars > 0 && (
                  <span className="float-right text-yellow-500">★ {apt.avgStars}</span>
                )}
              </div>
            )}

            {data?.deposit != null && data.deposit > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("listing.deposit")}: {formatVNPrice(data.deposit)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
