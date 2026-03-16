import { Property } from '@/lib/mock-data';
import { PropertyGrid } from './PropertyGrid';

interface RelatedPostsProps {
  properties: Property[];
}

export const RelatedPosts = ({ properties }: RelatedPostsProps) => {
  if (properties.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="section-title mb-6">Phòng tương tự</h2>
      <PropertyGrid properties={properties} columns={4} />
    </section>
  );
};
