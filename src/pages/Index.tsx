import { HeroSearch } from '@/components/HeroSearch';
import { FilterBar } from '@/components/FilterBar';
import { PropertyGrid } from '@/components/PropertyGrid';
import { AppDownload } from '@/components/AppDownload';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { SEO } from '@/components/SEO';
import { mockProperties } from '@/lib/mock-data';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { t } = useTranslation();

  const features = [
    { icon: Zap, title: t('features.fast'), desc: t('features.fastDesc') },
    { icon: Eye, title: t('features.visual'), desc: t('features.visualDesc') },
    { icon: Shield, title: t('features.trusted'), desc: t('features.trustedDesc') },
  ];

  const filteredProperties = useMemo(() => {
    if (activeFilters.length === 0) return mockProperties.slice(0, 6);
    return mockProperties.filter(p => {
      if (activeFilters.includes('under3m') && p.price >= 3000000) return false;
      if (activeFilters.includes('under5m') && p.price >= 5000000) return false;
      if (activeFilters.includes('furnished') && !p.furnished) return false;
      if (activeFilters.includes('studio') && p.type !== 'Studio') return false;
      if (activeFilters.includes('central') && !p.distance?.includes('km')) return false;
      if (activeFilters.includes('balcony') && !p.hasBalcony) return false;
      if (activeFilters.includes('apartment') && p.type !== 'Căn hộ') return false;
      if (activeFilters.includes('room') && p.type !== 'Phòng trọ') return false;
      return true;
    }).slice(0, 6);
  }, [activeFilters]);

  const toggleFilter = (key: string) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="XanhStay - Tìm phòng trọ, căn hộ cho thuê" description="Nền tảng tìm phòng trọ và căn hộ cho thuê thông minh tại Việt Nam." />
      <Navbar />
      <HeroSearch />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-title">{t('listing.featured')}</h2>
            <p className="section-subtitle mt-1">{t('listing.featuredSub')}</p>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t('listing.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
        <FilterBar activeFilters={activeFilters} onToggle={toggleFilter} />
        <div className="mt-6">
          <PropertyGrid properties={filteredProperties} />
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/search" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t('listing.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default Index;
