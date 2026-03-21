import { Shield, Leaf, Users, Sparkles, HeartHandshake, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Shield,
    title: 'Uy tín & Minh bạch',
    desc: 'Mọi thông tin phòng trọ đều được xác minh, đảm bảo chính xác và đáng tin cậy.',
  },
  {
    icon: Leaf,
    title: 'Sống xanh, sống bền',
    desc: 'Hướng tới không gian sống thân thiện với môi trường và bền vững cho cộng đồng.',
  },
  {
    icon: Users,
    title: 'Cộng đồng gắn kết',
    desc: 'Kết nối chủ nhà và người thuê trong một hệ sinh thái an toàn, hỗ trợ lẫn nhau.',
  },
  {
    icon: Sparkles,
    title: 'Đổi mới sáng tạo',
    desc: 'Ứng dụng công nghệ hiện đại để mang đến trải nghiệm tìm phòng nhanh chóng, tiện lợi.',
  },
  {
    icon: HeartHandshake,
    title: 'Tận tâm phục vụ',
    desc: 'Luôn lắng nghe và đồng hành cùng khách hàng với thái độ chuyên nghiệp, tận tình.',
  },
  {
    icon: Eye,
    title: 'Trực quan & Dễ dùng',
    desc: 'Giao diện trực quan, bản đồ tương tác giúp tìm phòng dễ dàng chỉ trong vài bước.',
  },
];

export const CoreValues = () => {
  return (
    <section className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Giá trị cốt lõi</h2>
          <p className="section-subtitle mt-2">
            Những giá trị nền tảng định hình XanhStay
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/20 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <v.icon size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
