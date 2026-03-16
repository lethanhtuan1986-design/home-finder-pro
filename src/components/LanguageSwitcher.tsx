import { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JPN' },
  { code: 'ko', label: 'KOR' },
  { code: 'zh', label: 'CN' },
];

export const LanguageSwitcher = () => {
  const [current, setCurrent] = useState('vi');
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Globe size={16} />
        <span className="font-medium">{languages.find(l => l.code === current)?.label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-soft z-50 py-1 min-w-[80px]">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setCurrent(lang.code); setOpen(false); }}
                className={`block w-full text-left px-3 py-1.5 text-sm transition-colors ${
                  current === lang.code ? 'text-primary font-medium bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
