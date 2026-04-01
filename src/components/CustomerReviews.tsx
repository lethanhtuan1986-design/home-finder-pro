import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { httpRequest, getImageUrl } from '@/services/index';
import feedbackService, { FeedbackItem } from '@/services/feedback.service';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

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

  const duplicated = [...reviews, ...reviews];

  return (
    <section className="py-12 md:py-16 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="section-title text-center">{t('reviews.title')}</h2>
        <p className="section-subtitle mt-2 text-center">{t('reviews.subtitle')}</p>
      </div>

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
  const [expanded, setExpanded] = useState(false);
  const avatar = review.userPostUu?.profileImage
    ? getImageUrl(review.userPostUu.profileImage)
    : null;

  const dateStr = review.createdAt
    ? format(new Date(review.createdAt), 'dd/MM/yyyy')
    : null;

  const contentLong = (review.comment?.length || 0) > 120;

  return (
    <div className="shrink-0 w-[300px] sm:w-[340px] bg-card border border-border rounded-2xl p-5 space-y-3">
      {/* Header: avatar + name + stars + date */}
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
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < review.stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
                />
              ))}
            </div>
            {dateStr && (
              <span className="text-[10px] text-muted-foreground">{dateStr}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <p className={`text-sm text-muted-foreground leading-relaxed ${!expanded && contentLong ? 'line-clamp-3' : ''}`}>
          {review.comment}
        </p>
        {contentLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary font-medium mt-1 flex items-center gap-0.5 hover:underline"
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {/* Apartment info */}
      {review.apartmentUu?.name && (
        <div className="text-xs space-y-0.5">
          <p className="text-primary font-medium truncate">
            {review.apartmentUu.name}
          </p>
          {review.apartmentUu.address && (
            <p className="text-muted-foreground truncate">
              {review.apartmentUu.address}, {review.apartmentUu.ward?.fullName}, {review.apartmentUu.province?.fullName}
            </p>
          )}
        </div>
      )}

      {/* Apartment name */}
      {review.apartmentUu?.name && (
        <p className="text-xs text-primary font-medium truncate">
          {review.apartmentUu.name}
        </p>
      )}
    </div>
  );
};
