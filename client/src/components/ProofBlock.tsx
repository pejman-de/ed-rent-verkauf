import { MapPin, Network, Zap, ShieldCheck } from "lucide-react";

export default function ProofBlock() {
  const items = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Zentraler Standort",
      desc: "Eigene Ausstellungsfläche und Werkstatt zur persönlichen Besichtigung und schnellen Übergabe."
    },
    {
      icon: <Network className="h-6 w-6 text-primary" />,
      title: "Starkes Netzwerk",
      desc: "Direkter Zugriff auf Großbestände führender Hersteller. Das sichert beste Preise und kurze Lieferzeiten."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Schnelle Abwicklung",
      desc: "Digitale Prozesse und ein fester B2B-Ansprechpartner sorgen für reibungslose Standzeiten für Ihren Betrieb."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Geprüfte Sicherheit",
      desc: "Jedes geprüfte Nutzfahrzeug wird mit neuem TÜV, HU/AU und lückenlosem Prüfbericht ausgeliefert."
    }
  ];

  return (
    <section className="bg-background py-16 lg:py-24 border-b border-muted/10">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="font-sans text-xs font-bold tracking-wider text-muted uppercase">
            Sicherheit & Vertrauen
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Warum ED Rent & Sale?
          </h2>
          <p className="font-sans text-base text-muted leading-relaxed">
            Als spezialisierter B2B-Händler wissen wir, dass Nutzfahrzeuge arbeiten müssen. Deshalb richten wir all unsere Prozesse auf maximale Zuverlässigkeit aus.
          </p>
        </div>

        {/* 4-Column Proof Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col p-6 border border-muted/20 bg-secondary/20 hover:bg-secondary/40 rounded-sm transition-colors duration-150"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-accent text-accent-foreground mb-6">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-primary mb-2">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
