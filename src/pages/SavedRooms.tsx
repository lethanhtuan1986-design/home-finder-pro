import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PropertyGrid } from '@/components/PropertyGrid';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import { mockProperties } from '@/lib/mock-data';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SavedRooms = () => {
  const { savedIds } = useSavedRooms();
  const savedProperties = mockProperties.filter(p => savedIds.includes(p.id));
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t('saved.title')} description={t('saved.title')} />
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">{t('saved.title')}</h1>
        <p className="section-subtitle mb-8">{t('saved.count', { count: savedIds.length })}</p>

        {savedProperties.length > 0 ? (
          <PropertyGrid properties={savedProperties} />
        ) : (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">{t('saved.empty')}</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">{t('saved.emptyHint')}</p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t('nav.searchNow')}
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedRooms;
