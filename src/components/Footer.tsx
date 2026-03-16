import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">X</span>
              </div>
              <span className="font-bold text-lg">XanhStay</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t('footer.explore')}</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><Link to="/search" className="hover:opacity-100 transition-opacity">{t('footer.searchRooms')}</Link></li>
              <li><Link to="/map" className="hover:opacity-100 transition-opacity">{t('footer.mapView')}</Link></li>
              <li><Link to="/saved" className="hover:opacity-100 transition-opacity">{t('footer.savedRooms')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100 transition-opacity">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">{t('footer.terms')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t('footer.follow')}</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Facebook</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm opacity-40 space-y-1">
          <p>© 2026 XanhStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
