import { HeroSearch } from "@/components/HeroSearch";
import { CoreValues } from "@/components/CoreValues";
import { CustomerReviews } from "@/components/CustomerReviews";
import { TopPromoBanner } from "@/components/TopPromoBanner";
import { AdBannersSection } from "@/components/AdBannersSection";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-14 md:pb-0">
      <SEO
        title="XanhStay - Tìm phòng, căn hộ cho thuê"
        description="Nền tảng tìm phòng và căn hộ cho thuê thông minh tại Việt Nam."
      />
      <TopPromoBanner />
      <Navbar />
      <HeroSearch />

      {/* Ad Banners replacing listing sections */}
      <AdBannersSection />

      <CustomerReviews />
      <CoreValues />
      <FloatingCallButton />
      <Footer />
    </div>
  );
};

export default Index;
