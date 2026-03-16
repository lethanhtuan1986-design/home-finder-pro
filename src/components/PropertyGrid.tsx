import { Property } from '@/lib/mock-data';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  columns?: 2 | 3 | 4;
}

export const PropertyGrid = ({ properties, columns = 3 }: PropertyGridProps) => {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {properties.map((property, i) => (
        <PropertyCard key={property.id} data={property} index={i} />
      ))}
    </div>
  );
};
