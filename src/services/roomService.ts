const BASE_URL = "https://api-xanhstay.vn//api/v1";

// ==================== Types ====================

export interface BaseEntity {
  code: string | null;
  name: string;
  id: number;
  uuid: string;
  status: number;
  isMarketplace: number;
}

export interface OwnerUu extends BaseEntity {
  username?: string;
  email?: string;
  bankNumber?: string | null;
  bankName?: string | null;
  profileImage?: string | null;
  identityNumber?: string | null;
  phoneNumber?: string;
}

export interface ProvinceInfo {
  code: string;
  fullName: string;
  fullNameEn: string;
}

export interface WardInfo {
  code: string;
  fullName: string;
  fullNameEn: string;
  provinceCode: string;
}

export interface ApartmentUu extends BaseEntity {
  roomCount: number;
  avgStars: number;
  numFeedback: number;
  numChild: number;
  ownerUu: OwnerUu;
  apartmentSize: number;
  numFloor: number;
  apartmentTypeUu: BaseEntity;
  managerUu: OwnerUu;
  longitude: number | null;
  latitude: number | null;
  province: ProvinceInfo;
  ward: WardInfo;
  address: string;
  point: number | null;
  state: number;
}

export interface AdvertisementData {
  companyUu: BaseEntity;
  title: string;
  apartmentUu: ApartmentUu;
  price: number;
  deposit: number;
  isSaved: number;
  images: string[];
  preDeposit: number;
  start: string | null;
  canPreDeposit: boolean;
  userPreDeposit: string;
  point: number | null;
  id: number;
  uuid: string;
  status: number;
  isMarketplace: number;
}

export interface Pagination {
  totalCount: number;
  totalPage: number;
}

export interface ResponseError {
  code: number;
  message: string;
  trace: string | null;
}

export interface ResponseBase<T> {
  error: ResponseError;
  data: T;
}

export interface GetListAdvertisementRequest {
  keyword?: string;
  isPaging?: number;
  page?: number;
  pageSize?: number;
  typeFinding?: number;
  parentApartmentUuid?: string;
  apartmentCode?: string;
  apartmentUuid?: string;
  priceFrom?: number;
  priceTo?: number;
  adsLikeds?: string[];
  apartmentTypeUuid?: string;
  apartmentSizeFrom?: number;
  apartmentSizeTo?: number;
  numRoomFrom?: number;
  numRoomTo?: number;
  provinceId?: string;
  wardId?: string;
  address?: string;
}

export interface GetListAdvertisementResponse {
  items: AdvertisementData[];
  pagination: Pagination;
}

// ==================== API Functions ====================

export async function getListAdvertisement(
  request: GetListAdvertisementRequest
): Promise<ResponseBase<GetListAdvertisementResponse>> {
  const res = await fetch(
    `${BASE_URL}/Advertisement/customer-get-list-paged-advertisement`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ==================== Helpers ====================

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE_URL.replace("/api/v1", "")}/${path}`;
}

export function formatVNPrice(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m % 1 === 0 ? `${m} triệu` : `${m.toFixed(1)} triệu`;
  }
  return price.toLocaleString("vi-VN") + "đ";
}
