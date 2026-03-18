

## Plan: Thiết kế lại Popup Map Marker Premium

### Thay đổi

**1. `src/components/MapView.tsx` — Viết lại `buildPopupHtml`**

- Mở rộng popup width từ 240px lên 280px
- **Header**: Background gradient nhạt (`hsl(var(--xanh-50))`), icon SVG MapPin thay emoji, font lớn hơn, padding thoáng hơn
- **List items**: 
  - Ảnh thumbnail tăng lên 72x54px với `border-radius: 10px`
  - Thêm hover effect qua CSS class (đổi nền khi hover, bo góc `8px`)
  - Tên phòng font 13px đậm, giá font 14px bold màu primary
  - Bỏ border-bottom cứng, dùng gap tự nhiên
- **CTA button**: Nút "+X phòng khác" thiết kế thành button thực thụ với gradient background, padding lớn hơn, border-radius tròn, hover scale effect, icon mũi tên
- Thêm `className: "leaflet-popup-premium"` vào `marker.bindPopup` options

**2. `src/index.css` — Thêm CSS overrides cho popup premium**

- `.leaflet-popup-premium .leaflet-popup-content-wrapper`: border-radius 16px, box-shadow sâu mềm (`0 12px 32px rgba(0,0,0,0.12)`), border nhẹ, padding 0
- `.leaflet-popup-premium .leaflet-popup-content`: margin 0, width auto
- `.leaflet-popup-premium .leaflet-popup-tip`: match background card
- Hover styles cho `.popup-room-item:hover` (background accent, smooth transition)
- CTA button hover: scale nhẹ + opacity

Toàn bộ vẫn dùng inline styles + CSS classes trong HTML string (không cần ReactDOMServer vì popup Leaflet hoạt động tốt với HTML thuần, và giữ đơn giản). CSS variables từ design system được tận dụng tối đa qua `hsl(var(...))`.

