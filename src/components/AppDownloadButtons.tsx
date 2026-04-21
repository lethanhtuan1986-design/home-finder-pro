import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import appleLogo from "@/assets/apple.svg";
import ggPlayLogo from "@/assets/gg_play.svg";
import qrAppStore from "@/assets/qr-appstore.png";
import qrGooglePlay from "@/assets/qr-googleplay.png";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  detectPlatform,
} from "@/lib/app-links";

type Store = "ios" | "android";

interface Props {
  /** Style preset for the buttons */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Renders App Store + Google Play buttons.
 * - On iOS: clicking either opens the App Store directly.
 * - On Android: clicking either opens Google Play directly.
 * - On Desktop: opens a QR code dialog for the chosen store.
 */
export const AppDownloadButtons = ({ variant = "dark", className = "" }: Props) => {
  const { t } = useTranslation();
  const [qrStore, setQrStore] = useState<Store | null>(null);

  const handleClick = (store: Store) => {
    const platform = detectPlatform();
    if (platform === "ios") {
      window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (platform === "android") {
      window.open(GOOGLE_PLAY_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setQrStore(store);
  };

  const baseBtn =
    variant === "dark"
      ? "bg-foreground text-background hover:opacity-90"
      : "bg-background text-foreground border border-border hover:bg-secondary";

  return (
    <>
      <div className={`flex flex-wrap gap-3 ${className}`}>
        <button
          type="button"
          onClick={() => handleClick("ios")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-opacity ${baseBtn}`}
        >
          <img
            src={appleLogo}
            alt="Apple"
            className={`h-5 w-5 ${variant === "dark" ? "invert dark:invert-0" : ""}`}
          />
          App Store
        </button>
        <button
          type="button"
          onClick={() => handleClick("android")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-opacity ${baseBtn}`}
        >
          <img src={ggPlayLogo} alt="Google Play" className="h-5 w-5" />
          Google Play
        </button>
      </div>

      <Dialog open={qrStore !== null} onOpenChange={(o) => !o && setQrStore(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {qrStore === "ios"
                ? t("appDownload.qrTitleIos", "Quét mã để tải trên App Store")
                : t("appDownload.qrTitleAndroid", "Quét mã để tải trên Google Play")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t(
                "appDownload.qrDesc",
                "Mở camera điện thoại và quét mã QR bên dưới để tải ứng dụng XanhStay."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="bg-white p-4 rounded-2xl border border-border">
              <img
                src={qrStore === "ios" ? qrAppStore : qrGooglePlay}
                alt={qrStore === "ios" ? "App Store QR" : "Google Play QR"}
                className="w-56 h-56 object-contain"
              />
            </div>
            <a
              href={qrStore === "ios" ? APP_STORE_URL : GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {t("appDownload.openLink", "Hoặc mở liên kết trực tiếp")}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
