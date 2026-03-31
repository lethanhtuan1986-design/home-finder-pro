import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import adBanner1 from '@/assets/ad-banner-1.jpg';
import adBanner2 from '@/assets/ad-banner-2.jpg';
import adBanner3 from '@/assets/ad-banner-3.jpg';

const banners = [
  {
    image: adBanner1,
    title: 'Căn hộ cao cấp trung tâm',
    description: 'Không gian sống hiện đại, tiện nghi đầy đủ ngay lòng thành phố.',
    cta: 'Khám phá ngay',
    link: '/search?apartmentTypeUuid=',
  },
  {
    image: adBanner2,
    title: 'Ưu đãi thanh toán dài hạn',
    description: 'Thanh toán trước 6 tháng giảm 3%, 12 tháng giảm 5%.',
    cta: 'Nhận ưu đãi',
    link: '/search',
  },
  {
    image: adBanner3,
    title: 'Phòng view đẹp giá tốt',
    description: 'Tận hưởng không gian xanh mát với tầm nhìn thoáng đãng.',
    cta: 'Xem ngay',
    link: '/search?typeOrder=4',
  },
];

export const AdBannersSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner, i) => (
          <Link
            key={i}
            to={banner.link}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
          >
            {/* Background image with hover zoom */}
            <img
              src={banner.image}
              alt={banner.title}
              loading="lazy"
              width={800}
              height={512}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                {banner.title}
              </h3>
              <p className="text-sm text-white/80 mb-3 line-clamp-2">
                {banner.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-primary/90 hover:bg-primary px-4 py-2 rounded-lg w-fit transition-colors">
                {banner.cta}
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
