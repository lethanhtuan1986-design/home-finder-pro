import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ja', label: 'JPN', name: '日本語' },
  { code: 'ko', label: 'KOR', name: '한국어' },
  { code: 'zh', label: 'CN', name: '中文' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = i18n.language?.substring(0, 2) || 'vi';

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Globe size={16} />
        <span className="font-medium">{languages.find(l => l.code === current)?.label || 'VI'}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-soft z-50 py-1 min-w-[120px]">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`block w-full text-left px-3 py-1.5 text-sm transition-colors ${
                  current === lang.code ? 'text-primary font-medium bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <span className="font-medium">{lang.label}</span>
                <span className="ml-2 opacity-60">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
