import { Share2, Facebook, Link2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  className?: string;
}

export const ShareButton = ({ title, className = "" }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã sao chép liên kết");
      setOpen(false);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
    setOpen(false);
  };

  const shareZalo = () => {
    window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, "_blank");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:bg-secondary hover:shadow-md transition-all ${className}`}
        >
          <Share2 size={18} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Chia sẻ</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="space-y-1">
          <button
            onClick={shareFacebook}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground"
          >
            <Facebook size={18} className="text-blue-600" />
            Facebook
          </button>
          <button
            onClick={shareZalo}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground"
          >
            <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none">
              <rect width="48" height="48" rx="10" fill="#0068FF" />
              <path d="M13 16h14l-14 12h14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="35" cy="22" r="4" fill="white" />
            </svg>
            Zalo
          </button>
          <div className="border-t border-border my-1" />
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground"
          >
            <Link2 size={18} className="text-primary" />
            Sao chép liên kết
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
