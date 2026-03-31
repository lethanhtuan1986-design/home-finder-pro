import { useQuery } from '@tanstack/react-query';
import { httpRequest, getImageUrl } from '@/services/index';
import feedbackService, { FeedbackData } from '@/services/feedback.service';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Fallback mock testimonials when API returns empty
const mockTestimonials: FeedbackData[] = [
  {
    uuid: 'mock-1', id: 1, status: 1, stars: 5,
    content: 'Tìm phòng trên XanhStay rất nhanh và tiện lợi. Thông tin chính xác, không lo bị lừa!',
    createdAt: '2025-03-15',
    userUu: { uuid: 'u1', name: 'Nguyễn Văn An' },
  },
  {
    uuid: 'mock-2', id: 2, status: 1, stars: 5,
    content: 'Giao diện đẹp, dễ dùng. Mình đã tìm được phòng ưng ý chỉ trong 2 ngày!',
    createdAt: '2025-03-10',
    userUu: { uuid: 'u2', name: 'Trần Thị Mai' },
  },
  {
    uuid: 'mock-3', id: 3, status: 1, stars: 4,
    content: 'Bản đồ rất trực quan, tiết kiệm thời gian đi xem phòng rất nhiều.',
    createdAt: '2025-02-28',
    userUu: { uuid: 'u3', name: 'Lê Hoàng Dũng' },
  },
  {
    uuid: 'mock-4', id: 4, status: 1, stars: 5,
    content: 'Đội ngũ hỗ trợ nhiệt tình, phản hồi nhanh. Rất hài lòng với dịch vụ của XanhStay.',
    createdAt: '2025-02-20',
    userUu: { uuid: 'u4', name: 'Phạm Thùy Linh' },
  },
  {
    uuid: 'mock-5', id: 5, status: 1, stars: 5,
    content: 'Ưu đãi thanh toán trước rất hấp dẫn, giúp tiết kiệm chi phí đáng kể mỗi tháng.',
    createdAt: '2025-02-15',
    userUu: { uuid: 'u5', name: 'Hoàng Minh Tuấn' },
  },
  {
    uuid: 'mock-6', id: 6, status: 1, stars: 4,
    content: 'Lần đầu dùng app tìm phòng mà thấy ấn tượng. Ảnh thật, giá cả minh bạch.',
    createdAt: '2025-01-30',
    userUu: { uuid: 'u6', name: 'Đỗ Thanh Hà' },
  },
];

const TestimonialCard = ({ feedback }: { feedback: FeedbackData }) => {
  const user = feedback.userUu;
  const avatar = user?.profileImage ? getImageUrl(user.profileImage) : null;

  return (
    <div className="flex-shrink-0 w-[320px] bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < feedback.stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
          />
        ))}
      </div>
      <p className="text-sm text-foreground leading-relaxed line-clamp-4">"{feedback.content}"</p>
      <div className="flex items-center gap-3 pt-1">
        <Avatar className="h-9 w-9">
          {avatar && <AvatarImage src={avatar} alt={user?.name || ''} />}
          <AvatarFallback className="bg-accent text-primary text-xs font-bold">
            {(user?.name || 'K').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{user?.name || 'Khách hàng'}</p>
          <p className="text-xs text-muted-foreground">Khách hàng XanhStay</p>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  const { t } = useTranslation();

  const { data: feedbackData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () =>
      httpRequest({
        http: feedbackService.getListPaged({
          isPaging: 1,
          page: 1,
          pageSize: 10,
          stars: 4,
          status: 1,
        }),
      }),
  });

  const feedbacks: FeedbackData[] =
    (feedbackData as any)?.items?.length > 0 ? (feedbackData as any).items : mockTestimonials;

  // Duplicate for seamless infinite scroll
  const allFeedbacks = [...feedbacks, ...feedbacks];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="section-title text-center">{t('testimonials.title')}</h2>
        <p className="section-subtitle text-center mt-2">{t('testimonials.subtitle')}</p>
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-slow inline-flex gap-6 py-2">
          {allFeedbacks.map((fb, i) => (
            <TestimonialCard key={`${fb.uuid}-${i}`} feedback={fb} />
          ))}
        </div>
      </div>
    </section>
  );
};
