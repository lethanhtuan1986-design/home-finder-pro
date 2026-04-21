

## Chuyển Map từ Google Maps tiles sang OpenStreetMap

### Mục tiêu
Thay thế tile layer Google Maps hiện tại (`mt0.google.com/vt/lyrs=m`) bằng OpenStreetMap chính thống trong toàn bộ ứng dụng, đảm bảo tuân thủ điều khoản sử dụng của OSM và giữ nguyên trải nghiệm người dùng.

### Phạm vi thay đổi

**1. File `src/components/MapView.tsx` (chính)**
- Thay thế tile layer Google Maps bằng OpenStreetMap Standard tiles:
  - URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Subdomains: `['a', 'b', 'c']`
  - Attribution: `'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'` (bắt buộc theo ToS của OSM)
  - `maxZoom: 19` (giới hạn của OSM, giảm từ 20)
- Giữ nguyên toàn bộ logic markers, popup, cluster, search overlay, fly-to, my-location, bounds emit.

**2. File `src/components/MiniMapPreview.tsx` (kiểm tra & cập nhật nếu có dùng tile)**
- Nếu đang dùng Google tiles → đổi sang OSM với cùng cấu hình.
- Nếu đang dùng iframe Google Maps Embed (theo memory `map-and-location-logic`) → giữ nguyên hoặc thay bằng iframe OpenStreetMap Embed (`https://www.openstreetmap.org/export/embed.html?bbox=...&marker=...`). Sẽ xác nhận sau khi đọc file.

### Lưu ý kỹ thuật
- OSM yêu cầu **attribution rõ ràng** trên bản đồ — Leaflet tự render attribution control nên chỉ cần truyền đúng chuỗi.
- OSM Standard tile có **rate limit** (chính sách fair use). Nếu sau này lưu lượng cao, có thể cân nhắc các nhà cung cấp tile dựa trên OSM (Carto, Stadia, MapTiler) — không nằm trong scope lần này.
- `maxZoom` giảm từ 20 → 19; logic `fitBounds` đang dùng `maxZoom: 15` nên không bị ảnh hưởng.
- Không cần cài thêm dependency mới — Leaflet đã có sẵn.
- Không thay đổi style marker, popup, hay bất kỳ UI nào khác.

### Các trang/tính năng bị ảnh hưởng (chỉ về tile background)
- `/search/map` — Trang bản đồ tìm kiếm
- Mini map preview trong trang Chi tiết phòng (nếu đang dùng Leaflet tiles)

### Kiểm thử sau khi triển khai
- Trang `/search/map`: tile load đúng, attribution OSM hiển thị góc dưới phải, markers/popup/search hoạt động bình thường.
- Mobile: pan/zoom mượt, không bị giật.
- Trang chi tiết phòng: mini map vẫn render đúng vị trí.

