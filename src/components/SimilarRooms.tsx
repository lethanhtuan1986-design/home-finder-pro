import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { httpRequest } from "@/services/index";
import advertisementService, { AdvertisementData } from "@/services/advertisement.service";
import { AdvertisementCard } from "@/components/AdvertisementCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface SimilarRoomsProps {
  advertisementUuid: string;
}

export const SimilarRooms = ({ advertisementUuid }: SimilarRoomsProps) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data } = useQuery<{ items: AdvertisementData[] }>({
    queryKey: ["similar-rooms", advertisementUuid],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getSimilar({
          uuid: advertisementUuid,
          isPaging: 1,
          page: 1,
          pageSize: 10,
        }),
      }),
    enabled: !!advertisementUuid,
  });

  const items = data?.items ?? [];

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el?.removeEventListener("scroll", updateScrollState);
  }, [items]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-foreground">
          {t("detail.similarRooms", "Phòng tương tự")}
        </h2>
        {items.length > 0 && (
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-accent/30 rounded-xl">
          <Search size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-base font-medium text-foreground">{t("detail.noSimilarRooms", "Hiện tại chưa có phòng tương tự nào.")}</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        >
          {items.map((item, i) => (
            <div key={item.uuid} className="shrink-0 w-[280px] sm:w-[300px] snap-start">
              <AdvertisementCard data={item} index={i} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
