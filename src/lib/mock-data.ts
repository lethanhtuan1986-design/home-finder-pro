export interface Property {
  id: string;
  title: string;
  price: number;
  size: number;
  district: string;
  ward: string;
  address: string;
  type: 'Studio' | 'Phòng trọ' | 'Căn hộ' | 'Mini' | 'Duplex';
  images: string[];
  description: string;
  amenities: string[];
  capacity: number;
  lat: number;
  lng: number;
  furnished: boolean;
  hasBalcony: boolean;
  distance?: string;
}

export const DISTRICTS = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7',
  'Bình Thạnh', 'Phú Nhuận', 'Tân Bình', 'Gò Vấp', 'Thủ Đức',
];

export const ROOM_TYPES = ['Studio', 'Phòng trọ', 'Căn hộ', 'Mini', 'Duplex'];

export const AMENITIES_LIST = [
  'WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bếp', 'Ban công',
  'Bảo vệ 24/7', 'Thang máy', 'Chỗ để xe', 'Nội thất đầy đủ',
  'Giường', 'Tủ quần áo', 'Bàn làm việc', 'WC riêng',
];

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
];

export const mockProperties: Property[] = [
  {
    id: 'xs-001',
    title: 'Studio Ban Công - Vinhomes Central Park',
    price: 8500000,
    size: 35,
    district: 'Bình Thạnh',
    ward: 'Phường 22',
    address: '208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh',
    type: 'Studio',
    images: [ROOM_IMAGES[0], ROOM_IMAGES[5], ROOM_IMAGES[6]],
    description: 'Studio cao cấp với ban công rộng rãi, view sông Sài Gòn. Nội thất đầy đủ, tiện nghi hiện đại. Gần trung tâm thương mại, siêu thị, trường học.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Ban công', 'Bảo vệ 24/7', 'Thang máy', 'Nội thất đầy đủ'],
    capacity: 2,
    lat: 10.794,
    lng: 106.721,
    furnished: true,
    hasBalcony: true,
    distance: '2.1 km từ trung tâm',
  },
  {
    id: 'xs-002',
    title: 'Phòng trọ sạch sẽ - Quận 1',
    price: 3500000,
    size: 20,
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    address: '45 Lý Tự Trọng, Phường Bến Nghé, Quận 1',
    type: 'Phòng trọ',
    images: [ROOM_IMAGES[1], ROOM_IMAGES[3], ROOM_IMAGES[7]],
    description: 'Phòng trọ sạch sẽ, thoáng mát ngay trung tâm Quận 1. Gần chợ Bến Thành, thuận tiện di chuyển.',
    amenities: ['WiFi', 'Điều hòa', 'WC riêng', 'Chỗ để xe'],
    capacity: 1,
    lat: 10.773,
    lng: 106.700,
    furnished: false,
    hasBalcony: false,
    distance: '0.5 km từ trung tâm',
  },
  {
    id: 'xs-003',
    title: 'Căn hộ 2PN - Masteri Thảo Điền',
    price: 15000000,
    size: 70,
    district: 'Quận 2',
    ward: 'Thảo Điền',
    address: '159 Xa lộ Hà Nội, Thảo Điền, Quận 2',
    type: 'Căn hộ',
    images: [ROOM_IMAGES[2], ROOM_IMAGES[4], ROOM_IMAGES[0]],
    description: 'Căn hộ cao cấp 2 phòng ngủ tại Masteri Thảo Điền. View đẹp, nội thất sang trọng, tiện ích đầy đủ.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bếp', 'Ban công', 'Bảo vệ 24/7', 'Thang máy', 'Nội thất đầy đủ', 'Giường', 'Tủ quần áo'],
    capacity: 4,
    lat: 10.802,
    lng: 106.738,
    furnished: true,
    hasBalcony: true,
    distance: '4.2 km từ trung tâm',
  },
  {
    id: 'xs-004',
    title: 'Mini House - Phú Nhuận',
    price: 4200000,
    size: 25,
    district: 'Phú Nhuận',
    ward: 'Phường 2',
    address: '120 Phan Xích Long, Phường 2, Phú Nhuận',
    type: 'Mini',
    images: [ROOM_IMAGES[3], ROOM_IMAGES[1], ROOM_IMAGES[5]],
    description: 'Mini house xinh xắn, đầy đủ nội thất tại Phú Nhuận. Khu vực yên tĩnh, an ninh tốt.',
    amenities: ['WiFi', 'Điều hòa', 'Tủ lạnh', 'Giường', 'Tủ quần áo', 'Bàn làm việc', 'WC riêng'],
    capacity: 1,
    lat: 10.800,
    lng: 106.680,
    furnished: true,
    hasBalcony: false,
    distance: '1.8 km từ trung tâm',
  },
  {
    id: 'xs-005',
    title: 'Studio Full Nội Thất - Tân Bình',
    price: 5500000,
    size: 30,
    district: 'Tân Bình',
    ward: 'Phường 12',
    address: '88 Cộng Hòa, Phường 12, Tân Bình',
    type: 'Studio',
    images: [ROOM_IMAGES[4], ROOM_IMAGES[2], ROOM_IMAGES[6]],
    description: 'Studio full nội thất gần sân bay Tân Sơn Nhất. Bếp riêng, ban công thoáng mát.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bếp', 'Ban công', 'Chỗ để xe', 'Nội thất đầy đủ'],
    capacity: 2,
    lat: 10.812,
    lng: 106.660,
    furnished: true,
    hasBalcony: true,
    distance: '5.3 km từ trung tâm',
  },
  {
    id: 'xs-006',
    title: 'Duplex Cao Cấp - Quận 7',
    price: 12000000,
    size: 55,
    district: 'Quận 7',
    ward: 'Tân Phong',
    address: '29 Nguyễn Lương Bằng, Tân Phong, Quận 7',
    type: 'Duplex',
    images: [ROOM_IMAGES[5], ROOM_IMAGES[0], ROOM_IMAGES[3]],
    description: 'Duplex thiết kế hiện đại tại khu Phú Mỹ Hưng. Không gian rộng rãi, 2 tầng riêng biệt.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bếp', 'Ban công', 'Bảo vệ 24/7', 'Thang máy', 'Nội thất đầy đủ', 'Giường', 'Tủ quần áo', 'Bàn làm việc'],
    capacity: 3,
    lat: 10.730,
    lng: 106.720,
    furnished: true,
    hasBalcony: true,
    distance: '7.1 km từ trung tâm',
  },
  {
    id: 'xs-007',
    title: 'Phòng trọ giá rẻ - Gò Vấp',
    price: 2200000,
    size: 18,
    district: 'Gò Vấp',
    ward: 'Phường 3',
    address: '56 Nguyễn Oanh, Phường 3, Gò Vấp',
    type: 'Phòng trọ',
    images: [ROOM_IMAGES[6], ROOM_IMAGES[4], ROOM_IMAGES[1]],
    description: 'Phòng trọ giá rẻ, sạch sẽ. Gần đại học Văn Lang, thuận tiện cho sinh viên.',
    amenities: ['WiFi', 'WC riêng', 'Chỗ để xe'],
    capacity: 1,
    lat: 10.832,
    lng: 106.680,
    furnished: false,
    hasBalcony: false,
    distance: '8.5 km từ trung tâm',
  },
  {
    id: 'xs-008',
    title: 'Căn hộ dịch vụ - Quận 3',
    price: 9800000,
    size: 45,
    district: 'Quận 3',
    ward: 'Phường 7',
    address: '123 Võ Văn Tần, Phường 7, Quận 3',
    type: 'Căn hộ',
    images: [ROOM_IMAGES[7], ROOM_IMAGES[2], ROOM_IMAGES[5]],
    description: 'Căn hộ dịch vụ cao cấp tại trung tâm Quận 3. Dọn phòng hàng tuần, bảo trì miễn phí.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bếp', 'Bảo vệ 24/7', 'Thang máy', 'Nội thất đầy đủ', 'Giường', 'Bàn làm việc', 'WC riêng'],
    capacity: 2,
    lat: 10.780,
    lng: 106.690,
    furnished: true,
    hasBalcony: false,
    distance: '1.2 km từ trung tâm',
  },
  {
    id: 'xs-009',
    title: 'Studio view hồ bơi - Quận 4',
    price: 6800000,
    size: 32,
    district: 'Quận 4',
    ward: 'Phường 1',
    address: '2 Bến Vân Đồn, Phường 1, Quận 4',
    type: 'Studio',
    images: [ROOM_IMAGES[0], ROOM_IMAGES[7], ROOM_IMAGES[3]],
    description: 'Studio mới xây, view hồ bơi tuyệt đẹp. Nội thất cao cấp, thiết kế thông minh.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Ban công', 'Bảo vệ 24/7', 'Thang máy', 'Nội thất đầy đủ'],
    capacity: 2,
    lat: 10.760,
    lng: 106.706,
    furnished: true,
    hasBalcony: true,
    distance: '1.5 km từ trung tâm',
  },
  {
    id: 'xs-010',
    title: 'Phòng trọ - Thủ Đức',
    price: 2800000,
    size: 22,
    district: 'Thủ Đức',
    ward: 'Phường Linh Trung',
    address: '78 Võ Văn Ngân, Linh Trung, Thủ Đức',
    type: 'Phòng trọ',
    images: [ROOM_IMAGES[1], ROOM_IMAGES[6], ROOM_IMAGES[4]],
    description: 'Phòng trọ gần ĐH Quốc gia, giá sinh viên. An ninh tốt, khu vực yên tĩnh.',
    amenities: ['WiFi', 'Điều hòa', 'WC riêng', 'Chỗ để xe', 'Giường'],
    capacity: 1,
    lat: 10.850,
    lng: 106.770,
    furnished: false,
    hasBalcony: false,
    distance: '12 km từ trung tâm',
  },
  {
    id: 'xs-011',
    title: 'Căn hộ Sunrise City - Quận 7',
    price: 11500000,
    size: 60,
    district: 'Quận 7',
    ward: 'Tân Hưng',
    address: '33 Nguyễn Hữu Thọ, Tân Hưng, Quận 7',
    type: 'Căn hộ',
    images: [ROOM_IMAGES[2], ROOM_IMAGES[5], ROOM_IMAGES[7]],
    description: 'Căn hộ Sunrise City view đẹp, nội thất hiện đại. Khu vực an ninh, nhiều tiện ích xung quanh.',
    amenities: ['WiFi', 'Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bếp', 'Ban công', 'Bảo vệ 24/7', 'Thang máy', 'Nội thất đầy đủ'],
    capacity: 3,
    lat: 10.740,
    lng: 106.700,
    furnished: true,
    hasBalcony: true,
    distance: '6.8 km từ trung tâm',
  },
  {
    id: 'xs-012',
    title: 'Mini Apartment - Bình Thạnh',
    price: 4800000,
    size: 28,
    district: 'Bình Thạnh',
    ward: 'Phường 25',
    address: '188 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh',
    type: 'Mini',
    images: [ROOM_IMAGES[3], ROOM_IMAGES[0], ROOM_IMAGES[6]],
    description: 'Mini apartment mới xây, sạch sẽ. Gần chợ, siêu thị, trạm xe buýt.',
    amenities: ['WiFi', 'Điều hòa', 'Tủ lạnh', 'Giường', 'WC riêng', 'Chỗ để xe'],
    capacity: 1,
    lat: 10.808,
    lng: 106.710,
    furnished: true,
    hasBalcony: false,
    distance: '3.5 km từ trung tâm',
  },
];

export const FILTER_CHIPS = [
  { label: 'Dưới 3 triệu', key: 'under3m' },
  { label: 'Dưới 5 triệu', key: 'under5m' },
  { label: 'Có nội thất', key: 'furnished' },
  { label: 'Studio', key: 'studio' },
  { label: 'Gần trung tâm', key: 'central' },
  { label: 'Có ban công', key: 'balcony' },
  { label: 'Căn hộ', key: 'apartment' },
  { label: 'Phòng trọ', key: 'room' },
];

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find(p => p.id === id);
}

export function getRelatedProperties(id: string): Property[] {
  const current = getPropertyById(id);
  if (!current) return [];
  return mockProperties
    .filter(p => p.id !== id && (p.district === current.district || p.type === current.type))
    .slice(0, 4);
}

export function filterProperties(params: {
  district?: string;
  priceMax?: number;
  priceMin?: number;
  type?: string;
  size?: number;
  furnished?: boolean;
  hasBalcony?: boolean;
  search?: string;
}): Property[] {
  return mockProperties.filter(p => {
    if (params.district && p.district !== params.district) return false;
    if (params.priceMax && p.price > params.priceMax) return false;
    if (params.priceMin && p.price < params.priceMin) return false;
    if (params.type && p.type !== params.type) return false;
    if (params.size && p.size < params.size) return false;
    if (params.furnished && !p.furnished) return false;
    if (params.hasBalcony && !p.hasBalcony) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.district.toLowerCase().includes(q) || p.ward.toLowerCase().includes(q);
    }
    return true;
  });
}

export function formatPrice(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m % 1 === 0 ? `${m} triệu` : `${m.toFixed(1)} triệu`;
  }
  return price.toLocaleString('vi-VN') + 'đ';
}

export function formatPriceShort(price: number): string {
  return (price / 1000000).toFixed(1).replace('.0', '') + 'tr';
}
