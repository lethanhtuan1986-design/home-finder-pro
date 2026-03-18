

## Plan: Thiết kế lại Popup Map Marker Premium

### Thay đổi

**1. `src/components/MapView.tsx` — Viết lại `buildPopupHtml`**

- Popup width tăng lên 280px
- **Header**: Background `hsl(var(--xanh-50))`, SVG MapPin icon thay emoji, font 13px bold, sub-text số phòng, padding 10px 12px, border-radius top 16px
- **List items**: Dùng class `popup-room-item` cho hover effect (CSS xử lý), ảnh 72x54px với border-radius 10px, tên phòng 13px semibold, giá 14px bold dùng `hsl(var(--primary))`, bỏ border-bottom thay bằng gap qua padding, thêm diện tích nếu có
- **CTA**: Nút gradient `hsl(var(--primary))` → emerald, padding 10px, border-radius 10px, font 13px bold, icon mũi tên →, class `popup-cta-btn` cho hover scale
- Thêm `className: "leaflet-popup-premium"` vào `marker.bindPopup` options, maxWidth 300

**2. `src/index.css` — Thêm/sửa CSS overrides**

- `.leaflet-popup-premium .leaflet-popup-content-wrapper`: border-radius 16px, box-shadow `0 12px 32px rgba(0,0,0,0.12)`, padding 0, border 1px solid `hsl(var(--border))`
- `.leaflet-popup-premium .leaflet-popup-content`: margin 0, width auto
- `.leaflet-popup-premium .leaflet-popup-tip`: match card background
- `.popup-room-item:hover`: background `hsl(var(--accent))`, border-radius 8px, transition 0.15s
- `.popup-cta-btn:hover`: transform scale(1.02), opacity 0.9
- Xóa/thay thế các CSS `.leaflet-popup-custom` cũ nếu còn

