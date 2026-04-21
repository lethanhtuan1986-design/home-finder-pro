export const APP_STORE_URL = "https://apps.apple.com/us/app/xanh-stay/id6758001190";
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.xanh.stay";

export type DevicePlatform = "ios" | "android" | "desktop";

export const detectPlatform = (): DevicePlatform => {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || (navigator as any).vendor || "";
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
  // iPadOS 13+ reports as Mac with touch
  if (/Macintosh/.test(ua) && "ontouchend" in document) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
};
