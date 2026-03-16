import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">X</span>
              </div>
              <span className="font-bold text-lg">XanhStay</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Nền tảng tìm phòng trọ và căn hộ cho thuê thông minh tại Việt Nam.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Khám phá</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><Link to="/search" className="hover:opacity-100 transition-opacity">Tìm phòng</Link></li>
              <li><Link to="/map" className="hover:opacity-100 transition-opacity">Bản đồ</Link></li>
              <li><Link to="/saved" className="hover:opacity-100 transition-opacity">Phòng đã lưu</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Liên hệ</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Điều khoản</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Theo dõi</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Facebook</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm opacity-40">
          © 2026 XanhStay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
