import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import InteractiveGallery from "@/components/InteractiveGallery";
import USPSection from "@/components/USPSection";
import ProcessAndMetrics from "@/components/ProcessAndMetrics";
import ProofBlock from "@/components/ProofBlock";
import DealerPath from "@/components/DealerPath";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  // Smooth scroll to inquiry form
  const scrollToAnfrage = (vehicleName?: string) => {
    if (vehicleName) {
      setSelectedVehicle(vehicleName);
    } else {
      setSelectedVehicle("");
    }
    
    const element = document.getElementById("anfrage");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Smooth scroll to gallery
  const scrollToGallery = () => {
    const element = document.getElementById("gallery");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Sticky Header */}
      <Header onCtaClick={() => scrollToAnfrage()} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onPrimaryClick={() => scrollToAnfrage()}
          onSecondaryClick={scrollToGallery}
        />

        {/* Social Proof Brand Bar */}
        <SocialProof />

        {/* Interactive Gallery (Core Element) */}
        <InteractiveGallery onInquireClick={scrollToAnfrage} />

        {/* USP Section */}
        <USPSection />

        {/* Process & Trust Metrics */}
        <ProcessAndMetrics />

        {/* Proof Block */}
        <ProofBlock />

        {/* Dealer Path (Power-Conversion block) */}
        <DealerPath onCtaClick={() => scrollToAnfrage("Händler-Paketanfrage")} />

        {/* Lead Form Section with Complex Logic */}
        <LeadForm prefilledVehicle={selectedVehicle} />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
