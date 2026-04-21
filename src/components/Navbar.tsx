import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Home, Building2, Download, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AppDownloadButtons } from './AppDownloadButtons';
import { detectPlatform, APP_STORE_URL, GOOGLE_PLAY_URL } from '@/lib/app-links';

export const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const isHome = location.pathname === '/';

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const platform = detectPlatform();
    if (platform === 'ios') {
      window.open(APP_STORE_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    if (platform === 'android') {
      window.open(GOOGLE_PLAY_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setDownloadOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/search', label: t('nav.search'), icon: Search },
    { to: '/search/map', label: t('nav.map'), icon: MapPin },
    { to: '/saved', label: t('nav.saved'), icon: Heart },
    { to: '/policy?tab=about', label: t('nav.about'), icon: Building2 },
  ];

  // On homepage: fully transparent at top, solid with blur on scroll
  // On other pages: always solid
  const isTransparent = isHome && !scrolled;

  return (
    <nav
      style={{ top: 'var(--promo-banner-height, 0px)' }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-card/90 backdrop-blur-xl border-b border-border shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.svg"
              alt="XanhStay"
              className={`h-8 transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to || (link.to.includes('?') && location.pathname === link.to.split('?')[0])
                    ? isTransparent
                      ? 'bg-white/20 text-white'
                      : 'bg-accent text-accent-foreground'
                    : isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={handleDownloadClick}
              className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isTransparent
                  ? 'border border-white/50 text-white hover:bg-white/10'
                  : 'border border-primary text-primary hover:bg-primary/10'
              }`}
            >
              <Download size={16} />
              {t('nav.download')}
            </button>
          </div>

          {/* Mobile header right */}
          <div className="md:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={handleDownloadClick}
              className={`p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-primary hover:bg-primary/10'
              }`}
              aria-label={t('nav.download')}
            >
              <Download size={20} />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t('appDownload.title', 'Tải ứng dụng XanhStay')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('appDownload.subtitle', 'Chọn nền tảng để xem mã QR và tải ứng dụng.')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-2">
            <AppDownloadButtons />
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
