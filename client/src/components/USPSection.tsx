import { ShieldCheck, Truck, Percent, Wrench } from "lucide-react";

export default function USPSection() {
  const usps = [
    {
      num: "01",
      icon: <ShieldCheck className="h-6 w-6 text-accent" />,
      title: "Garantierte Qualität",
      desc: "Jedes Fahrzeug durchläuft vor der Übergabe unseren strengen 120-Punkte-Check. Inklusive B2B-Garantie für maximale Sorgenfreiheit."
    },
    {
      num: "02",
      icon: <Truck className="h-6 w-6 text-accent" />,
      title: "Flexible Logistik",
      desc: "Wahlweise bequeme Selbstabholung an unseren Standorten oder bundesweite Direktlieferung bis auf Ihren Betriebshof."
    },
    {
      num: "03",
      icon: <Percent className="h-6 w-6 text-accent" />,
      title: "GEFA Finanzierung",
      desc: "Maßgeschneiderte Leasing-, Mietkauf- und Finanzierungsangebote direkt über unseren starken Partner, die GEFA Bank."
    },
    {
      num: "04",
      icon: <Wrench className="h-6 w-6 text-accent" />,
      title: "Sonderaufbauten",
      desc: "Koffer, Pritsche, Kühlkoffer oder Plane – wir realisieren Ihren individuellen Branchenaufbau exakt nach Ihren Vorgaben."
    }
  ];

  return (
    <section className="bg-background py-16 lg:py-24 border-b border-muted/10">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 border border-muted/30 bg-secondary px-3 py-1 rounded-sm">
            <span className="font-sans text-xs font-bold tracking-wider text-primary uppercase">
              Unser Versprechen
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
            Ein Ansprechpartner. Vier Leistungen.
          </h2>
          <p className="font-sans text-base text-muted leading-relaxed">
            Wir reduzieren die Komplexität Ihres Fuhrparkmanagements. Verlassen Sie sich auf einheitliche Standards und exzellenten B2B-Rundumservice.
          </p>
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, idx) => (
            <div
              key={idx}
              className="relative flex flex-col p-6 border border-muted/20 bg-background hover:border-muted/40 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-200 group hover:shadow-md"
            >
              {/* Top Row with Number and Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary text-primary rounded-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {usp.icon}
                </div>
                <span className="font-display font-bold text-4xl text-muted/20 group-hover:text-accent/40 transition-colors">
                  {usp.num}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-bold text-lg text-primary mb-2">
                {usp.title}
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                {usp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
