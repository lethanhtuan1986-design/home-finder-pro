import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Home, Building2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import appleSvg from '@/assets/apple.svg';
import ggPlaySvg from '@/assets/gg_play.svg';

export const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/search', label: t('nav.search'), icon: Search },
    { to: '/saved', label: t('nav.saved'), icon: Heart },
    { to: '/policy?tab=about', label: t('nav.about'), icon: Building2 },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-card/95 backdrop-blur-xl border-b border-border shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="XanhStay" className="h-8" />
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
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
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
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isTransparent
                  ? 'border border-white/40 text-white hover:bg-white/10'
                  : 'border border-primary text-primary hover:bg-primary/10'
              }`}
            >
              <Download size={16} />
              {t('appDownload.downloadBtn', 'Tải ứng dụng')}
            </a>
          </div>

          {/* Mobile header right */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
