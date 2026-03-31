import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bannerAd1 from "@/assets/banner-ad-1.jpg";
import bannerAd2 from "@/assets/banner-ad-2.jpg";
import bannerAd3 from "@/assets/banner-ad-3.jpg";

const banners = [
  {
    image: bannerAd1,
    title: "Căn hộ cao cấp giá tốt",
    description: "Không gian sống hiện đại, tiện nghi đầy đủ ngay trung tâm",
    cta: "Khám phá ngay",
    link: "/search?apartmentTypeUuid=",
  },
  {
    image: bannerAd2,
    title: "Ưu đãi tháng này",
    description: "Giảm đến 5% khi thanh toán trước — cơ hội có hạn!",
    cta: "Nhận ưu đãi",
    link: "/search?typeOrder=1",
  },
  {
    image: bannerAd3,
    title: "Phòng mới cập nhật",
    description: "Hàng trăm phòng mới mỗi ngày, đừng bỏ lỡ",
    cta: "Xem ngay",
    link: "/search?typeOrder=0",
  },
];

export const AdBannersSection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {banners.map((b, i) => (
        <Link
          key={i}
          to={b.link}
          className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
        >
          <img
            src={b.image}
            alt={b.title}
            loading="lazy"
            width={800}
            height={512}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-lg font-bold mb-1 text-white drop-shadow-md">{b.title}</h3>
            <p className="text-sm text-white/90 mb-3 drop-shadow-sm">{b.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-white drop-shadow-sm group-hover:underline">
              {b.cta} <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);
