import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import appleLogo from "@/assets/apple.svg";
import ggPlayLogo from "@/assets/gg_play.svg";

export const DepositButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-secondary text-foreground py-3.5 rounded-xl font-semibold hover:bg-secondary/80 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm border border-border"
      >
        <ShieldCheck size={16} />
        {t("deposit.button", "Đặt cọc ngay")}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t("deposit.dialogTitle", "Đặt cọc qua ứng dụng")}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {t(
                "deposit.dialogDesc",
                "Để đặt cọc phòng, vui lòng tải ứng dụng XanhStay trên điện thoại."
              )}
            </p>
            <div className="flex justify-center gap-3">
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                <img
                  src={appleLogo}
                  alt="Apple"
                  className="h-5 w-5 invert dark:invert-0"
                />
                App Store
              </button>
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                <img src={ggPlayLogo} alt="Google Play" className="h-5 w-5" />
                Google Play
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
