import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CommunitySection from "@/components/CommunitySection";
import ProblemSection from "@/components/ProblemSection";
import DemoSection from "@/components/DemoSection";
import CircularFeatures from "@/components/CircularFeatures";
import TimelinePreview from "@/components/TimelinePreview";
import FeatureGrid from "@/components/FeatureGrid";
import PricingSection from "@/components/PricingSection";
import PetHealthTips from "@/components/PetHealthTips";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background font-poppins">
    <Navbar />
    <HeroSection />
    <CommunitySection />
    <ProblemSection />
    <DemoSection />
    <CircularFeatures />
    <TimelinePreview />
    <FeatureGrid />
    <PetHealthTips />
    <FAQSection />
    <PricingSection />
    <TestimonialsSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
