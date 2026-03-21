import { Shield, Leaf, Users, Sparkles, HeartHandshake, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const valueKeys = [
  { icon: Shield, titleKey: 'coreValues.trust', descKey: 'coreValues.trustDesc' },
  { icon: Leaf, titleKey: 'coreValues.green', descKey: 'coreValues.greenDesc' },
  { icon: Users, titleKey: 'coreValues.community', descKey: 'coreValues.communityDesc' },
  { icon: Sparkles, titleKey: 'coreValues.innovation', descKey: 'coreValues.innovationDesc' },
  { icon: HeartHandshake, titleKey: 'coreValues.service', descKey: 'coreValues.serviceDesc' },
  { icon: Eye, titleKey: 'coreValues.intuitive', descKey: 'coreValues.intuitiveDesc' },
];

export const CoreValues = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-center">{t('coreValues.sectionTitle')}</h2>
          <p className="section-subtitle mt-2 text-center">
            {t('coreValues.sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueKeys.map((v, i) => (
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
                <h3 className="font-semibold text-foreground mb-1">{t(v.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
