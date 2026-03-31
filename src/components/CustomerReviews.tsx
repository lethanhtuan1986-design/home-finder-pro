import { useQuery } from '@tanstack/react-query';
import { httpRequest, getImageUrl } from '@/services/index';
import feedbackService, { FeedbackItem } from '@/services/feedback.service';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

export const CustomerReviews = () => {
  const { t } = useTranslation();

  const { data: feedbackData } = useQuery<{ items: FeedbackItem[] }>({
    queryKey: ['customer-reviews'],
    queryFn: () =>
      httpRequest({
        http: feedbackService.getListPaged({
          isPaging: 1,
          page: 1,
          pageSize: 20,
          status: 1,
        }),
      }),
  });

  const reviews = feedbackData?.items ?? [];

  if (reviews.length === 0) return null;

  // Duplicate for infinite scroll effect
  const duplicated = [...reviews, ...reviews];

  return (
    <section className="py-12 md:py-16 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="section-title text-center">{t('reviews.title')}</h2>
        <p className="section-subtitle mt-2 text-center">{t('reviews.subtitle')}</p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]">
          {duplicated.map((review, i) => (
            <ReviewCard key={`${review.uuid}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewCard = ({ review }: { review: FeedbackItem }) => {
  const avatar = review.userPostUu?.profileImage
    ? getImageUrl(review.userPostUu.profileImage)
    : null;

  return (
    <div className="shrink-0 w-[300px] sm:w-[340px] bg-card border border-border rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {avatar && <AvatarImage src={avatar} alt={review.userPostUu?.name || ''} />}
          <AvatarFallback className="bg-accent text-primary font-bold text-sm">
            {(review.userPostUu?.name || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {review.userPostUu?.name || 'Người dùng'}
          </p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < review.stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
        {review.content}
      </p>
      {review.apartmentUu?.name && (
        <p className="text-xs text-primary font-medium truncate">
          {review.apartmentUu.name}
        </p>
      )}
    </div>
  );
};
