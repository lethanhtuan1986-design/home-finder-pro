

## Plan: Mở rộng bán kính tìm kiếm thêm 5km

### Vấn đề
Bounding box từ Nominatim trả về vùng khớp chính xác với địa danh, có thể quá hẹp khiến bỏ sót các phòng lân cận.

### Giải pháp
Trong `src/lib/geocoding.ts`, sau khi lấy được 4 điểm (south, north, west, east), mở rộng mỗi cạnh thêm 5km bằng cách:
- 1 độ vĩ (latitude) ~ 111km, nên 5km ~ 0.045 độ
- 1 độ kinh (longitude) phụ thuộc vĩ độ: 5km ~ 0.045 / cos(lat) độ

Tính toán `latBuffer = 5 / 111` và `lngBuffer = 5 / (111 * cos(centerLat))`, rồi trừ/cộng vào south/north/west/east trước khi trả về.

### File thay đổi
**`src/lib/geocoding.ts`** - Thêm logic expand bounding box sau dòng 24:
```typescript
const KM_BUFFER = 5;
const latBuffer = KM_BUFFER / 111;
const centerLat = (south + north) / 2;
const lngBuffer = KM_BUFFER / (111 * Math.cos((centerLat * Math.PI) / 180));

return {
  neLat: north + latBuffer,
  neLng: east + lngBuffer,
  swLat: south - latBuffer,
  swLng: west - lngBuffer,
};
```

Chỉ cần sửa 1 file duy nhất, tất cả các trang (SearchPage, MapSearchPage) tự động hưởng lợi.

