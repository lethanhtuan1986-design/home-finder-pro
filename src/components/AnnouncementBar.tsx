import { useTranslation } from 'react-i18next';

const announcements = [
  'announcement.promo1',
  'announcement.promo2',
  'announcement.promo3',
];

export const AnnouncementBar = () => {
  const { t } = useTranslation();

  const items = announcements.map((key) => t(key));
  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-flex gap-12 py-2 text-sm font-medium">
        {allItems.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
