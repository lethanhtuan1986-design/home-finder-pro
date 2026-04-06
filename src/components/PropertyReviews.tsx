import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { httpRequest, getImageUrl } from "@/services/index";
import feedbackService, { FeedbackItem } from "@/services/feedback.service";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface PropertyReviewsProps {
  apartmentUuid: string;
}

export const PropertyReviews = ({ apartmentUuid }: PropertyReviewsProps) => {
  const { t } = useTranslation();

  const { data: feedbackData } = useQuery({
    queryKey: ["property-reviews", apartmentUuid],
    queryFn: () =>
      httpRequest({
        http: feedbackService.getByUuid(apartmentUuid),
      }),
    enabled: !!apartmentUuid,
  });

  const rawData = feedbackData as any;
  const reviews: FeedbackItem[] = Array.isArray(rawData?.items) ? rawData.items : Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

  const avgStars = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length : 0;
  const totalReviews = reviews.length;

  return (
    <section className="mt-8">
      <h2 className="font-semibold text-lg mb-4 text-foreground">
        {t("detail.reviews", "Đánh giá từ khách hàng")}
      </h2>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-accent/30 rounded-xl">
          <Star size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-foreground">{t("detail.noReviews", "Chưa có đánh giá nào.")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("detail.noReviewsSub", "Hãy là người đầu tiên trải nghiệm và để lại đánh giá cho không gian này.")}</p>
        </div>
      ) : (
        <>
          {/* Summary header */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-accent/50 rounded-xl">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{avgStars.toFixed(1)}</p>
              <div className="flex gap-0.5 mt-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(avgStars) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalReviews} {t("detail.reviewCount", "đánh giá")}
              </p>
            </div>

            {/* Star distribution */}
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.stars === star).length;
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{star}</span>
                    <Star size={10} className="fill-yellow-400 text-yellow-400 shrink-0" />
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.uuid} review={review} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

const ReviewItem = ({ review }: { review: FeedbackItem }) => {
  const [expanded, setExpanded] = useState(false);
  const avatar = review.userPostUu?.profileImage ? getImageUrl(review.userPostUu.profileImage) : null;
  const dateStr = review.createdAt ? format(new Date(review.createdAt), "dd/MM/yyyy") : null;
  const contentLong = (review.comment?.length || 0) > 150;

  return (
    <div className="border border-border rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {avatar && <AvatarImage src={avatar} alt={review.userPostUu?.name || ""} />}
          <AvatarFallback className="bg-accent text-primary font-bold text-sm">
            {(review.userPostUu?.name || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {review.userPostUu?.name || "Người dùng"}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < review.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
                />
              ))}
            </div>
            {dateStr && <span className="text-[10px] text-muted-foreground">{dateStr}</span>}
          </div>
        </div>
      </div>

      <div>
        <p className={`text-sm text-muted-foreground leading-relaxed ${!expanded && contentLong ? "line-clamp-3" : ""}`}>
          {review.comment}
        </p>
        {contentLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary font-medium mt-1 flex items-center gap-0.5 hover:underline"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>
    </div>
  );
};
