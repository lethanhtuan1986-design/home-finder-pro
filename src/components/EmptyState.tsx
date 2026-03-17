import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo }: EmptyStateProps) => {
  return (
    <div className="text-center py-20">
      <Icon size={48} className="mx-auto mb-4 text-muted-foreground/30" />
      <p className="text-lg font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity mt-6"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};
