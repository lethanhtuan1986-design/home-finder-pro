import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PropertyGrid } from '@/components/PropertyGrid';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import { mockProperties } from '@/lib/mock-data';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedRooms = () => {
  const { savedIds } = useSavedRooms();
  const savedProperties = mockProperties.filter(p => savedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">Phòng đã lưu</h1>
        <p className="section-subtitle mb-8">{savedIds.length} phòng đã lưu</p>

        {savedProperties.length > 0 ? (
          <PropertyGrid properties={savedProperties} />
        ) : (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">Chưa có phòng nào được lưu</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Nhấn ❤️ trên các phòng bạn thích để lưu lại</p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Tìm phòng ngay
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedRooms;
