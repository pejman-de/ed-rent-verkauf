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
    <section className="relative overflow-hidden bg-background py-16 lg:py-24 border-b border-muted/10">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(110,124,149,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(110,124,149,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="container relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col space-y-8 lg:col-span-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-muted/30 bg-secondary px-3 py-1 rounded-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="font-sans text-xs font-bold tracking-wider text-primary uppercase">
                B2B Nutzfahrzeug-Spezialist
              </span>
            </div>
            
            <h1 className="font-display font-extrabold text-4xl tracking-tight text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
              Vom Sprinter <br className="hidden sm:inline" />
              bis zum LKW. <br />
              <span className="text-muted">Neu und gebraucht.</span> <br />
              Aus einer Hand.
            </h1>
            
            <p className="font-sans text-lg text-muted max-w-xl leading-relaxed">
              ED Rent & Sale ist Ihr verlässlicher Partner für erstklassige Nutzfahrzeuge. Wir bieten maßgeschneiderte B2B-Mobilitätslösungen für Handwerk, Logistik und Handel.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onPrimaryClick}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-extrabold px-8 py-6 text-base rounded-sm shadow-sm transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Fahrzeug konfigurieren</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={onSecondaryClick}
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-secondary font-sans font-bold px-8 py-6 text-base rounded-sm transition-all duration-150 active:scale-95 flex items-center justify-center"
            >
              Fahrzeugbestand ansehen
            </Button>
          </div>

          {/* Checkmarks */}
          <div className="space-y-3 pt-2 border-t border-muted/10">
            {checkmarks.map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-secondary text-primary mt-0.5">
                  <Check className="h-3.5 w-3.5 text-accent stroke-[3]" />
                </div>
                <span className="font-sans text-sm font-semibold text-primary/90">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual Column */}
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden border border-muted/30 bg-secondary rounded-sm shadow-md">
            {/* Aspect Ratio Container */}
            <div className="aspect-[16/10] w-full">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663281979359/iiQHyte9m2j8pb53mDZgmE/hero-vehicles-Q99sW2nsU53yUfKN45454Y.webp"
                alt="ED Rent & Sale Nutzfahrzeug-Lineup"
                className="h-full w-full object-cover object-center"
                loading="eager"
              />
            </div>
            {/* Visual overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          </div>
          
          {/* Accent badge */}
          <div className="absolute -bottom-6 -left-6 hidden sm:flex flex-col bg-primary p-5 border border-muted/20 rounded-sm shadow-lg max-w-[220px]">
            <span className="font-display font-extrabold text-3xl text-accent leading-none">
              100%
            </span>
            <span className="font-sans text-xs font-bold text-primary-foreground tracking-wider uppercase mt-1">
              B2B-Ausrichtung
            </span>
            <span className="font-sans text-xs text-muted-foreground mt-2 leading-snug">
              Individuelle Konditionen & Rahmenverträge ab 10 Fahrzeugen.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
