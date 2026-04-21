import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppDownloadButtons } from "@/components/AppDownloadButtons";

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
            <div className="flex justify-center">
              <AppDownloadButtons />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
