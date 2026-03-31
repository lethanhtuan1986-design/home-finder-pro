import { useState, useCallback } from "react";
import { HeroSearch } from "@/components/HeroSearch";
import { AdBannersSection } from "@/components/AdBannersSection";
import { CoreValues } from "@/components/CoreValues";
import { CustomerReviews } from "@/components/CustomerReviews";
import { TopPromoBanner } from "@/components/TopPromoBanner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import { SEO } from "@/components/SEO";

const Index = () => {
  const [bannerHeight, setBannerHeight] = useState(0);

  const handleBannerHeight = useCallback((h: number) => {
    setBannerHeight(h);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-14 md:pb-0">
      <SEO
        title="XanhStay - Tìm phòng, căn hộ cho thuê"
        description="Nền tảng tìm phòng và căn hộ cho thuê thông minh tại Việt Nam."
      />
      <TopPromoBanner onHeightChange={handleBannerHeight} />
      <Navbar topOffset={bannerHeight} />
      <HeroSearch />

      {/* 3 Ad Banners */}
      <AdBannersSection />

      <CustomerReviews />
      <CoreValues />
      <FloatingCallButton />
      <Footer />
    </div>
  );
};

export default Index;
