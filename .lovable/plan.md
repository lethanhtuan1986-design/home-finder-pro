

## Chuyển Autocomplete tìm kiếm địa điểm sang Google Places API (giữ Leaflet + OSM tiles)

### Mục tiêu
Tile bản đồ vẫn là OpenStreetMap (Leaflet), nhưng toàn bộ thanh tìm kiếm địa điểm (autocomplete + lấy tọa độ) chuyển sang **Google Places API** để gợi ý chính xác hơn cho địa chỉ Việt Nam, đồng thời tối ưu chi phí bằng SessionToken + chỉ request `geometry`.

### Cấu hình môi trường
- Thêm biến `VITE_GOOGLE_MAPS_API_KEY` vào `.env` và khai báo trong `src/vite-env.d.ts`.
- Nếu thiếu key → fallback về luồng Nominatim hiện tại (không vỡ UI), đồng thời log cảnh báo 1 lần.
- Yêu cầu user bật trong Google Cloud Console: **Places API** (legacy) — cần để dùng `AutocompleteService` + `PlacesService.getDetails`. Có thể giới hạn key theo HTTP referrer (`xanhstay.vn`, `*.lovable.app`, `localhost`).

### Kiến trúc code

**1. Loader script Google Maps — `src/lib/google-maps-loader.ts` (mới)**
- Hàm `loadGoogleMaps()` trả về `Promise<typeof google>` — chỉ chèn `<script>` 1 lần, dedupe nhiều caller song song.
- URL: `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places&language=vi&region=VN&loading=async`.
- Trả `null` nếu thiếu key.

**2. Custom hook — `src/hooks/useGooglePlaces.ts` (mới)**
- Quản lý:
  - `AutocompleteService` (singleton sau khi script load).
  - `PlacesService` (gắn vào `<div>` ẩn nội bộ).
  - `AutocompleteSessionToken` — tạo mới sau mỗi lần `getDetails` thành công (kết thúc phiên).
- API trả về:
  ```ts
  {
    ready: boolean;
    loading: boolean;          // đang fetch predictions
    predictions: PlacePrediction[];
    search: (input: string) => void;   // debounce 500ms bên trong
    getDetails: (placeId: string) => Promise<{ lat: number; lng: number; address: string } | null>;
    clear: () => void;
  }
  ```
- Cấu hình request: `componentRestrictions: { country: 'vn' }`, `language: 'vi'`, `sessionToken`.
- `getDetails` chỉ truyền `fields: ['geometry', 'formatted_address']` (formatted_address để hiển thị popup; cùng SKU rẻ với geometry-only nếu cần có thể bỏ — sẽ dùng `description` từ prediction thay thế để giữ chi phí tối thiểu chỉ `['geometry']`).
  - **Quyết định:** Chỉ request `['geometry']`. Hiển thị tên = `prediction.description` đã có sẵn → không tốn thêm phí Place Data.

**3. Refactor `src/components/LocationAutocomplete.tsx`**
- Giữ nguyên props public (`value`, `onChange`, `onSelect`, `enrichSuffix`, `radiusKm`, `placeholder`, `className`, `inputClassName`) để các caller (`HeroSearch`, `SearchPage`, `MapSearchPage`) **không phải đổi**.
- Bên trong:
  - Dùng `useGooglePlaces` nếu `ready === true`; không thì fallback Nominatim cũ (cùng debounce 500ms — nâng từ 400ms hiện tại).
  - Gõ phím → `search(value)` (hook tự debounce).
  - Spinner `Loader2` khi `loading`.
  - Dropdown render predictions: icon `MapPin`, `structured_formatting.main_text` đậm + `secondary_text` xám nhỏ (UI giống Airbnb/Grab). Bo góc `rounded-xl`, shadow mềm, max-height + scroll, hover `bg-accent`, animation fade/slide nhẹ.
  - Click 1 item → `getDetails(place_id)` → khi có `{lat,lng}` quy đổi sang `GeoBounds` (dùng helper mới `latLngToBounds(lat, lng, radiusKm)` trong `geocoding.ts` thay cho `nominatimResultToBounds`) rồi gọi `onSelect(prediction, bounds)`.
  - `onChange(prediction.structured_formatting.main_text)` để input hiện tên ngắn gọn.
- Responsive: dropdown `w-full` theo input; trên mobile padding lớn hơn (`py-3`), font 14px; desktop giữ như hiện tại.

**4. `src/lib/geocoding.ts`**
- Thêm helper `latLngToBounds(lat, lng, radiusKm): GeoBounds` (đã có công thức trong `nominatimResultToBounds`, tách ra dùng chung).
- Giữ `searchNominatim` + `nominatimResultToBounds` làm fallback.

**5. `src/components/MapView.tsx`**
- Khi nhận `flyTo` mới: hiện tại đã `flyTo(zoom)`. **Cập nhật**: chấp nhận thêm field `label?: string` trong `FlyToTarget` → nếu có, đặt tạm 1 `L.marker` + popup mở sẵn hiển thị label tại điểm đó (auto-clear khi nhận `flyTo` mới hoặc null). Zoom mặc định khi user chọn từ Google Places = **16** (caller truyền vào).
- Tile OSM giữ nguyên.

**6. Cập nhật caller `MapSearchPage.tsx`**
- Khi `LocationAutocomplete.onSelect` được gọi (giờ trả tọa độ Google), truyền `flyTo={ lat, lng, zoom: 16, label: prediction.description }` xuống `MapView`.
- `HeroSearch` & `SearchPage`: chỉ cần `bounds` để filter — không đổi logic.

### Tối ưu chi phí (checklist tuân thủ)
- ✅ Debounce 500ms trên input.
- ✅ 1 `AutocompleteSessionToken` cho cả phiên gõ → click; refresh sau mỗi `getDetails`.
- ✅ `componentRestrictions: { country: 'vn' }`.
- ✅ `getDetails` chỉ `fields: ['geometry']` (rẻ nhất — Basic Data ~ free trong tier hiện tại của Place Details Essentials).
- ✅ Không gọi `getDetails` nếu user không click chọn.
- ✅ Không tự động query khi mount/focus rỗng.

### UI/UX (đồng bộ Airbnb/Grab)
- Input: `h-11`, `rounded-xl`, icon kính lúp trái, spinner/clear-X bên phải, focus ring.
- Dropdown:
  - `mt-2`, `rounded-2xl`, `shadow-xl`, `border border-border`, max-h `320px`, overflow scroll.
  - Mỗi item: 2 dòng — `main_text` (font-medium 14px) + `secondary_text` (text-muted-foreground 12px), padding `px-4 py-3`, hover bg, focus bg.
  - Empty state: "Không tìm thấy địa điểm" khi predictions rỗng & không loading & có keyword.
- Responsive: full-width trên mobile, dropdown chiếm full-width input; desktop giới hạn theo width input.

### Phạm vi ảnh hưởng
- File mới: `src/lib/google-maps-loader.ts`, `src/hooks/useGooglePlaces.ts`.
- File sửa: `src/components/LocationAutocomplete.tsx`, `src/lib/geocoding.ts` (thêm helper), `src/components/MapView.tsx` (label trên flyTo marker), `src/pages/MapSearchPage.tsx` (truyền label), `.env` (thêm key), `src/vite-env.d.ts` (khai báo type).
- Không động tới: tile layer OSM, marker logic phòng, bounds search, các page khác.

### Hành động cần ở user trước khi merge
1. Tạo Google Maps API Key, bật **Places API**, giới hạn theo HTTP referrer.
2. Cung cấp key để Lovable thêm vào `.env` dưới tên `VITE_GOOGLE_MAPS_API_KEY` (đây là **publishable key** dùng client-side — sẽ commit vào codebase qua `.env`, an toàn nếu đã giới hạn referrer).

