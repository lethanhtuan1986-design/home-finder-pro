import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Music2, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();

  const linkClass =
    "text-muted-foreground hover:text-primary transition-colors duration-300";
  const socialClass =
    "flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors duration-300";

  return (
    <footer className="bg-[hsl(220,20%,8%)] text-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 md:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1 – Logo & Slogan */}
          <div className="sm:col-span-2 lg:col-span-1 max-w-sm">
            <div className="flex items-center gap-2 mb-5">
              <img
                src="/images/logo.svg"
                alt="XanhStay"
                className="h-9 brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Col 2 – Khám phá */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-100 mb-4">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/search" className={linkClass}>
                  {t("footer.searchRooms")}
                </Link>
              </li>
              <li>
                <Link to="/search" className={linkClass}>
                  {t("footer.mapView")}
                </Link>
              </li>
              <li>
                <Link to="/saved" className={linkClass}>
                  {t("footer.savedRooms")}
                </Link>
              </li>
              <li>
                <Link to="/policy?tab=about" className={linkClass}>
                  Giới thiệu XanhStay
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 – Hỗ trợ */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-100 mb-4">
              {t("footer.support")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/policy?tab=about" className={linkClass}>
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <a href="#" className={linkClass}>
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/policy?tab=terms-xanhid" className={linkClass}>
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 – Kết nối */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-100 mb-4">
              {t("footer.follow")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className={socialClass}>
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className={socialClass}>
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="#" className={socialClass}>
                  <Music2 className="w-5 h-5" />
                  <span>TikTok</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Company info */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-6 text-sm">
            <div className="space-y-2 text-center md:text-left">
              <p className="font-semibold text-gray-100">
                {t("footer.companyName")}
              </p>
              <p className="text-gray-500">{t("footer.taxId")}: 0111320005</p>
              <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:xanhstay@gslgroup.vn"
                  className="hover:text-primary transition-colors duration-300 underline underline-offset-2"
                >
                  xanhstay@gslgroup.vn
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t("footer.address")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-600">
          <p>© 2026 XanhStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
