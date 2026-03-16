import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyGallery } from '@/components/PropertyGallery';
import { ScheduleForm } from '@/components/ScheduleForm';
import { RelatedPosts } from '@/components/RelatedPosts';
import { getPropertyById, getRelatedProperties, formatPrice } from '@/lib/mock-data';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import { MapPin, Maximize, Users, Heart, ChevronLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const property = getPropertyById(id || '');
  const related = getRelatedProperties(id || '');
  const { isSaved, toggleSave } = useSavedRooms();

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Không tìm thấy phòng này.</p>
          <Link to="/search" className="text-primary font-medium mt-4 inline-block hover:underline">
            ← Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft size={16} /> Quay lại
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PropertyGallery images={property.images} title={property.title} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-accent px-2 py-1 rounded">{property.type}</span>
                  <h1 className="text-2xl md:text-3xl font-bold mt-3 text-foreground">{property.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mt-2">
                    <MapPin size={16} /> {property.address}
                  </p>
                </div>
                <button
                  onClick={() => toggleSave(property.id)}
                  className="shrink-0 w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Heart size={20} className={isSaved(property.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'} />
                </button>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="price-display text-3xl">{formatPrice(property.price)}</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>

              <div className="flex gap-6 mt-6 py-4 border-y border-border text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Maximize size={16} /> {property.size}m²</span>
                <span className="flex items-center gap-2"><Users size={16} /> {property.capacity} người</span>
                {property.distance && <span>{property.distance}</span>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-semibold text-lg mb-3 text-foreground">Mô tả</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-semibold text-lg mb-3 text-foreground">Tiện nghi</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ScheduleForm propertyTitle={property.title} />
            </div>
          </div>
        </div>

        <RelatedPosts properties={related} />
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
