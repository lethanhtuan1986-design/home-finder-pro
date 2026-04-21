import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppDownloadButtons } from '@/components/AppDownloadButtons';

export const AppDownload = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="section-title mb-3">{t('appDownload.title')}</h2>
            <p className="section-subtitle mb-6">
              {t('appDownload.subtitle')}
            </p>
            <AppDownloadButtons />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div className="w-48 h-80 bg-muted rounded-3xl border-4 border-border flex items-center justify-center">
              <Smartphone size={48} className="text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
