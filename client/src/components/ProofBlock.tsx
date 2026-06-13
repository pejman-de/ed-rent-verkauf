import { MapPin, Network, Zap, ShieldCheck } from "lucide-react";

export default function ProofBlock() {
  const items = [
    {
      icon: <MapPin className="h-6 w-6 text-brand-navy" />,
      title: "Zentraler Standort",
      desc: "Eigene Ausstellungsfläche und Werkstatt zur persönlichen Besichtigung und schnellen Übergabe."
    },
    {
      icon: <Network className="h-6 w-6 text-brand-navy" />,
      title: "Starkes Netzwerk",
      desc: "Direkter Zugriff auf Großbestände führender Hersteller. Das sichert beste Preise und kurze Lieferzeiten."
    },
    {
      icon: <Zap className="h-6 w-6 text-brand-navy" />,
      title: "Schnelle Abwicklung",
      desc: "Digitale Prozesse und ein fester B2B-Ansprechpartner sorgen für reibungslose Standzeiten für Ihren Betrieb."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-navy" />,
      title: "Geprüfte Sicherheit",
      desc: "Jedes geprüfte Nutzfahrzeug wird mit neuem TÜV, HU/AU und lückenlosem Prüfbericht ausgeliefert."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-background py-20 border-b border-brand-grey/10">
      {/* Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6e7c950a_1px,transparent_1px),linear-gradient(to_bottom,#6e7c950a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan">
            Sicherheit & Vertrauen
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
            Warum ED Rent & Sale?
          </h2>
          <p className="font-sans text-base text-brand-grey leading-relaxed">
            Als spezialisierter B2B-Händler wissen wir, dass Nutzfahrzeuge arbeiten müssen. Deshalb richten wir all unsere Prozesse auf maximale Zuverlässigkeit aus.
          </p>
        </div>

        {/* 4-Column Proof Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-8 rounded-2xl border border-brand-grey/15 bg-white shadow-sm hover:shadow-xl hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy group-hover:bg-brand-cyan/15 group-hover:text-brand-cyan transition-colors mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-brand-navy mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-brand-grey leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
