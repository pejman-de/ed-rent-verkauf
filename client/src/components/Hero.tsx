import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export default function Hero({ onPrimaryClick, onSecondaryClick }: HeroProps) {
  const checkmarks = [
    "Sofort verfügbare Neufahrzeuge & geprüfte Gebrauchte",
    "Attraktive Leasing- & Finanzierungskonditionen (z.B. GEFA)",
    "Individuelle Sonderaufbauten nach Maß möglich"
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 border-b border-brand-grey/10 bg-gradient-to-b from-brand-light to-white">
      {/* Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6e7c950a_1px,transparent_1px),linear-gradient(to_bottom,#6e7c950a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="container relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col space-y-8 lg:col-span-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-navy md:text-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                B2B Nutzfahrzeug-Spezialist
              </span>
            </div>
            
            <h1 className="font-display font-extrabold text-4xl tracking-tight text-brand-navy sm:text-5xl md:text-6xl lg:leading-[1.1] whitespace-pre-line">
              Vom Sprinter bis LKW.{"\n"}
              <span className="block text-brand-cyan mt-1">Neu und gebraucht. 
Aus einer Hand.</span>
            </h1>
            
            <p className="font-sans text-lg text-brand-grey leading-relaxed md:text-xl max-w-xl">
              ED Rent & Sale ist Ihr verlässlicher Partner für erstklassige Nutzfahrzeuge. Maßgeschneiderte B2B-Mobilitätslösungen für Handwerk, Logistik und Handel. Ein Ansprechpartner, kein Behördenlauf.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onPrimaryClick}
              size="lg"
              className="bg-brand-cyan text-brand-navy hover:bg-brand-cyan/90 font-bold text-base px-8 py-6 shadow-lg shadow-brand-cyan/10 hover:shadow-brand-cyan/20 transition-all active:scale-97 flex items-center justify-center gap-2 rounded-xl" style={{height: '48px'}}
            >
              <span>Fahrzeug konfigurieren</span>
              <ArrowRight className="h-5 w-5 text-brand-navy" />
            </Button>
            
            <Button
              onClick={onSecondaryClick}
              size="lg"
              variant="outline"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-semibold text-base px-8 py-6 transition-all active:scale-97 flex items-center justify-center rounded-xl" style={{height: '48px'}}
            >
              Fahrzeugbestand ansehen
            </Button>
          </div>

          {/* Checkmarks */}
          <div className="space-y-3 pt-4 border-t border-brand-grey/10">
            {checkmarks.map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                  <Check className="h-5 w-5" />
                </div>
                <span className="font-sans text-sm font-semibold text-brand-navy leading-normal mt-2">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual Column */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl border border-brand-grey/10">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663281979359/iiQHyte9m2j8pb53mDZgmE/hero-vehicles-Q99sW2nsU53yUfKN45454Y.webp"
              alt="ED Rent & Sale Nutzfahrzeug-Lineup"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
            {/* Glass Overlay on Image */}
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-brand-navy/65 p-6 text-white backdrop-blur-md md:p-8">
              <span className="font-display font-extrabold text-4xl text-brand-cyan md:text-5xl tracking-tight leading-none">
                100%
              </span>
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan mt-1">
                B2B-Ausrichtung
              </p>
              <p className="font-sans text-sm text-white/80 mt-2 leading-snug">
                Geprüfte Qualität für Ihren Fuhrpark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
