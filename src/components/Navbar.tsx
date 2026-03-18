import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Heart, Home, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/search', label: t('nav.search'), icon: Search },
    { to: '/saved', label: t('nav.saved'), icon: Heart },
  ];

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="XanhStay" className="h-8" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/policy?tab=about"
              className="ml-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors flex items-center gap-2"
            >
              <Building2 size={16} />
              Về chúng tôi
            </Link>
            <Link
              to="/search"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Search size={16} />
              {t('nav.searchNow')}
            </Link>
          </div>

          <button
            ref={buttonRef}
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-card relative z-50"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <Link
                to="/terms?tab=about"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Building2 size={18} />
                Về chúng tôi
              </Link>
              <Link
                to="/search"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium mt-2"
              >
                {t('nav.searchNow')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
