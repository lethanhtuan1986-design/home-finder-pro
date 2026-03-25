import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bannerPromo from "@/assets/banner-promo.jpg";
import logoSrc from "@/assets/logo.svg";

export const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => navigate("/search")}
      >
        {/* Background image */}
        <img
          src={bannerPromo}
          alt="XanhStay khuyến mãi"
          className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          width={1920}
          height={1080}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14">
          <div className="max-w-lg space-y-4">
            {/* Logo */}
            <img src={logoSrc} alt="XanhStay" className="h-8 sm:h-10 brightness-0 invert" />

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Ưu đãi thanh toán dài hạn
            </h2>

            {/* Discount badges */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-center">
                <p className="text-3xl sm:text-4xl font-black text-white">3%</p>
                <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">Chu kỳ 6 tháng</p>
              </div>
              <div className="bg-primary/80 backdrop-blur-sm border border-primary/50 rounded-xl px-4 py-3 text-center">
                <p className="text-3xl sm:text-4xl font-black text-white">5%</p>
                <p className="text-white/90 text-xs sm:text-sm font-medium mt-0.5">Chu kỳ 12 tháng</p>
              </div>
            </div>

            {/* CTA */}
            <button className="bg-white text-foreground font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors">
              Tìm phòng ngay →
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
