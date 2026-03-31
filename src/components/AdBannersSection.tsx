import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import adBanner1 from "@/assets/ad-banner-1.jpg";
import adBanner2 from "@/assets/ad-banner-2.jpg";
import adBanner3 from "@/assets/ad-banner-3.jpg";

const banners = [
  {
    image: adBanner1,
    title: "Căn hộ cao cấp",
    description: "Không gian sống hiện đại, tràn ngập ánh sáng tự nhiên",
    cta: "Khám phá ngay",
    link: "/search?apartmentTypeUuid=luxury",
  },
  {
    image: adBanner2,
    title: "Ưu đãi tháng này",
    description: "Giảm đến 5% khi thanh toán trước 12 tháng",
    cta: "Nhận ưu đãi",
    link: "/search",
  },
  {
    image: adBanner3,
    title: "Phòng có ban công",
    description: "Tận hưởng không gian xanh giữa lòng thành phố",
    cta: "Xem thêm",
    link: "/search?apartmentTypeUuid=balcony",
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-6">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                {banner.title}
              </h3>
              <p className="text-white/80 text-sm mb-3 drop-shadow-sm">
                {banner.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-primary/80 hover:bg-primary px-4 py-2 rounded-lg w-fit transition-colors">
                {banner.cta} <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
