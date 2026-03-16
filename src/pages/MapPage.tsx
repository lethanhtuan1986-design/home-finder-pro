import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MapView } from '@/components/MapView';
import { PropertyCard } from '@/components/PropertyCard';
import { mockProperties } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

const MapPage = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-[45%] overflow-auto p-6 space-y-4 max-h-[calc(100vh-4rem)]">
          <h2 className="section-title">Bản đồ phòng trọ</h2>
          <p className="text-sm text-muted-foreground mb-4">{mockProperties.length} phòng trên bản đồ</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {mockProperties.map((p, i) => (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <PropertyCard data={p} index={i} />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-[55%] h-[50vh] lg:h-auto lg:sticky lg:top-16">
          <div className="h-full p-4 lg:p-0 lg:pr-4 lg:py-4">
            <MapView
              properties={mockProperties}
              hoveredId={hoveredId}
              onMarkerClick={(id) => navigate(`/property/${id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
