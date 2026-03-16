import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyGallery } from '@/components/PropertyGallery';
import { ScheduleForm } from '@/components/ScheduleForm';
import { SEO } from '@/components/SEO';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import {
  getAdvertisementByUuid,
  AdvertisementDetailData,
  formatVNPrice,
  getImageUrl,
} from '@/services/roomService';
import {
  MapPin, Maximize, Heart, ChevronLeft, Check, Phone,
  Building, Star, Eye, Zap, Droplets, Loader2, Bed, Sofa,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isSaved, toggleSave } = useSavedRooms();
  const [detail, setDetail] = useState<AdvertisementDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getAdvertisementByUuid({ uuid: id })
      .then(res => {
        if (res.error.code === 0) {
          setDetail(res.data);
        } else {
          setError(res.error.message);
        }
      })
      .catch(() => setError('Không thể tải thông tin bài đăng.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="aspect-[2/1] w-full rounded-2xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <SEO title="Không tìm thấy" description="Bài đăng không tồn tại hoặc đã bị xóa." />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">{error || 'Không tìm thấy bài đăng.'}</p>
          <Link to="/search" className="text-primary font-medium mt-4 inline-block hover:underline">
            ← Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  const apt = detail.apartmentUu;
  const images = detail.images.map(getImageUrl);
  const address = `${apt.address}, ${apt.ward?.fullName}, ${apt.province?.fullName}`;
  const descriptionText = apt.description || detail.description || detail.title;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: detail.title,
    description: descriptionText,
    image: images[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: apt.address,
      addressLocality: apt.ward?.fullName,
      addressRegion: apt.province?.fullName,
      addressCountry: 'VN',
    },
    offers: {
      '@type': 'Offer',
      price: detail.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    },
    ...(apt.avgStars > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: apt.avgStars,
        reviewCount: apt.numFeedback || 1,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${detail.title} - ${formatVNPrice(detail.price)}/tháng`}
        description={`${descriptionText.slice(0, 150)}. Diện tích ${apt.apartmentSize}m², ${apt.roomCount} phòng. Địa chỉ: ${address}`}
        ogImage={images[0]}
        ogType="article"
        jsonLd={jsonLd}
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft size={16} /> Quay lại
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PropertyGallery images={images} title={detail.title} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-accent px-2 py-1 rounded">
                    {apt.apartmentTypeUu?.name || 'Phòng'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold mt-3 text-foreground">{detail.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mt-2">
                    <MapPin size={16} /> {address}
                  </p>
                </div>
                <button
                  onClick={() => toggleSave(detail.uuid)}
                  className="shrink-0 w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Heart size={20} className={isSaved(detail.uuid) ? 'fill-destructive text-destructive' : 'text-muted-foreground'} />
                </button>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="price-display text-3xl">{formatVNPrice(detail.price)}</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 py-4 border-y border-border text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Maximize size={16} /> {apt.apartmentSize}m²</span>
                <span className="flex items-center gap-2"><Building size={16} /> {apt.numFloor} tầng</span>
                <span className="flex items-center gap-2"><Eye size={16} /> {detail.viewCount} lượt xem</span>
                {apt.avgStars > 0 && (
                  <span className="flex items-center gap-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" /> {apt.avgStars}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Description */}
            {descriptionText && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-semibold text-lg mb-3 text-foreground">Mô tả</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{descriptionText}</p>
              </motion.div>
            )}

            {/* Room types */}
            {apt.roomTypeGroups && apt.roomTypeGroups.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="font-semibold text-lg mb-3 text-foreground">Phòng</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {apt.roomTypeGroups.map(g => (
                    <div key={g.roomUu.uuid} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                      <Bed size={16} className="text-primary shrink-0" />
                      {g.roomUu.name} <span className="font-semibold text-foreground">×{g.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Furniture */}
            {apt.furnitureTypeGroups && apt.furnitureTypeGroups.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="font-semibold text-lg mb-3 text-foreground">Nội thất & Tiện nghi</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {apt.furnitureTypeGroups.map(g => (
                    <div key={g.furnitureUu.uuid} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-primary shrink-0" />
                      {g.furnitureUu.name} <span className="text-foreground font-medium">×{g.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Service prices */}
            {detail.adPrices && detail.adPrices.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="font-semibold text-lg mb-3 text-foreground">Chi phí dịch vụ</h2>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="text-left px-4 py-2.5 font-medium text-foreground">Dịch vụ</th>
                        <th className="text-right px-4 py-2.5 font-medium text-foreground">Giá</th>
                        <th className="text-right px-4 py-2.5 font-medium text-foreground">Đơn vị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.adPrices.map(sp => (
                        <tr key={sp.uuid} className="border-t border-border">
                          <td className="px-4 py-2.5 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              {sp.serviceUu.type === 0 ? <Zap size={14} className="text-yellow-500" /> :
                               sp.serviceUu.type === 1 ? <Droplets size={14} className="text-blue-500" /> :
                               <Sofa size={14} className="text-primary" />}
                              {sp.serviceUu.name}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium text-foreground">{formatVNPrice(sp.price)}</td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground">/{sp.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Deposit info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="bg-accent/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiền cọc</span>
                  <span className="font-semibold text-foreground">{formatVNPrice(detail.deposit)}</span>
                </div>
                {detail.preDeposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đặt cọc giữ chỗ</span>
                    <span className="font-semibold text-foreground">{formatVNPrice(detail.preDeposit)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Owner / Manager info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <h2 className="font-semibold text-lg mb-3 text-foreground">Thông tin liên hệ</h2>
              <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg">
                  {(apt.managerUu?.name || apt.ownerUu?.name || 'X').charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{apt.managerUu?.name || apt.ownerUu?.name}</p>
                  <p className="text-sm text-muted-foreground">Quản lý</p>
                </div>
                {detail.phoneNumber && (
                  <a
                    href={`tel:${detail.phoneNumber}`}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Phone size={16} /> {detail.phoneNumber}
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ScheduleForm propertyTitle={detail.title} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
