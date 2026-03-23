import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Heart, CalendarCheck, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AdvertisementData } from "@/services/advertisement.service";
import { formatVNPrice, getImageUrl } from "@/services/index";
import { useSavedRooms } from "@/hooks/useSavedRooms";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScheduleForm } from "@/components/ScheduleForm";
import appleSvg from "@/assets/apple.svg";
import ggPlaySvg from "@/assets/gg_play.svg";

interface AdvertisementCardProps {
  data: AdvertisementData;
  index?: number;
  showScheduleButton?: boolean;
  showDepositButton?: boolean;
}

export const AdvertisementCard = ({ data, index = 0, showScheduleButton = false, showDepositButton = false }: AdvertisementCardProps) => {
  const { isSaved, toggleSave } = useSavedRooms();
  const { t } = useTranslation();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const apt = data?.apartmentUu;
  const firstImage = data?.images?.[0];
  const imageUrl = firstImage ? getImageUrl(firstImage) : "/placeholder.svg";

  const locationParts = [apt?.ward?.fullName, apt?.province?.fullName].filter(Boolean);
  const locationText = locationParts.length > 0 ? locationParts.join(", ") : "Đang cập nhật";

  const typeName = apt?.apartmentTypeUu?.name || t("listing.room");
  const apartmentSize = apt?.apartmentSize;
  const roomCount = apt?.roomCount;

  const statsParts: string[] = [];
  if (apartmentSize != null && apartmentSize > 0) statsParts.push(`${apartmentSize}m²`);
  if (roomCount != null && roomCount > 0) statsParts.push(`${roomCount} ${t("listing.rooms")}`);

  const showActions = showScheduleButton || showDepositButton;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to={`/advertisement/${data?.uuid}`} className="block overflow-hidden">
        <div className="bg-card rounded-2xl overflow-hidden border border-border card-hover flex flex-col">
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
            <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-foreground">
              {typeName}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-4">
              <span className="text-white font-bold text-lg drop-shadow-sm">
                {formatVNPrice(data?.price ?? 0)}
                <span className="text-white/80 text-sm font-normal">{t("listing.perMonth")}</span>
              </span>
            </div>
          </div>

          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <h3 className="font-semibold text-foreground text-sm truncate" title={data?.title || ""}>
              {data?.title || "Đang cập nhật"}
            </h3>

            <p className="text-muted-foreground text-sm flex items-center gap-1.5">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span className="truncate">{locationText}</span>
            </p>

            {statsParts.length > 0 && (
              <div className="bg-secondary rounded-lg px-3 py-2 text-xs text-muted-foreground font-medium">
                {statsParts.join(" • ")}
                {apt?.avgStars != null && apt.avgStars > 0 && (
                  <span className="float-right text-yellow-500">★ {apt.avgStars}</span>
                )}
              </div>
            )}

            {/* Deposit info */}
            {data?.deposit != null && data.deposit > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("listing.deposit")}: {formatVNPrice(data.deposit)}
              </p>
            )}

            {/* Action buttons */}
            {showActions && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                {showScheduleButton && (
                  <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setScheduleOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <CalendarCheck size={14} />
                        {t("schedule.title")}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-md max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DialogHeader>
                        <DialogTitle>{t("schedule.title")}</DialogTitle>
                      </DialogHeader>
                      <ScheduleForm
                        propertyTitle={data?.title || ""}
                        apartmentUuid={apt?.uuid}
                        advertisementUuid={data?.uuid}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {showDepositButton && (
                  <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDepositOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Smartphone size={14} />
                        {t("listing.preDeposit")}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DialogHeader>
                        <DialogTitle>{t("depositModal.title")}</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("depositModal.description")}
                      </p>
                      <div className="flex flex-col gap-3">
                        <a
                          href="https://apps.apple.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
                        >
                          <img src={appleSvg} alt="App Store" className="w-8 h-8" />
                          <div>
                            <p className="text-xs text-muted-foreground">{t("depositModal.downloadOn")}</p>
                            <p className="text-sm font-semibold text-foreground">App Store</p>
                          </div>
                        </a>
                        <a
                          href="https://play.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
                        >
                          <img src={ggPlaySvg} alt="Google Play" className="w-8 h-8" />
                          <div>
                            <p className="text-xs text-muted-foreground">{t("depositModal.downloadOn")}</p>
                            <p className="text-sm font-semibold text-foreground">Google Play</p>
                          </div>
                        </a>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
