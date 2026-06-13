import { ShieldCheck, Truck, Percent, Wrench } from "lucide-react";

export default function USPSection() {
  const usps = [
    {
      num: "01",
      icon: <ShieldCheck className="h-6 w-6 text-brand-navy" />,
      title: "Garantierte Qualität",
      desc: "Jedes Fahrzeug durchläuft vor der Übergabe unseren 120-Punkte-Check. Inklusive D2D-Garantie für maximale Sorgenfreiheit."
    },
    {
      num: "02",
      icon: <Truck className="h-6 w-6 text-brand-navy" />,
      title: "Flexible Logistik",
      desc: "Wahlweise bequeme Selbstabholung an unseren Standorten oder bundesweite Direktlieferung bis zu Ihrem Betriebshof."
    },
    {
      num: "03",
      icon: <Percent className="h-6 w-6 text-brand-navy" />,
      title: "GEFA Finanzierung",
      desc: "Maßgeschneidertes Leasing oder Finanzierung direkt über unseren starken Partner, die GEFA Bank."
    },
    {
      num: "04",
      icon: <Wrench className="h-6 w-6 text-brand-navy" />,
      title: "Sonderaufbauten",
      desc: "Koffer, Pritsche, Kühlkoffer oder Plane. Wir realisieren Ihren individuellen Branchenaufbau exakt nach Vorgabe."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-background py-20 border-b border-brand-grey/10">
      {/* Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6e7c950a_1px,transparent_1px),linear-gradient(to_bottom,#6e7c950a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-navy md:text-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan">
              Unser Versprechen
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
            Ein Ansprechpartner. Vier Leistungen.
          </h2>
          <p className="font-sans text-base text-brand-grey leading-relaxed">
            Wir reduzieren die Komplexität Ihres Fuhrparkmanagements. Sie verlassen sich auf einheitliche Standards und exzellenten B2B-Rundumservice.
          </p>
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-8 rounded-2xl border border-brand-grey/15 bg-white shadow-sm hover:shadow-xl hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* Top Row with Number and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy group-hover:bg-brand-cyan/15 group-hover:text-brand-cyan transition-colors">
                    {usp.icon}
                  </div>
                  <span className="font-display font-bold text-4xl text-brand-grey/20 group-hover:text-brand-cyan/40 transition-colors">
                    {usp.num}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-display font-bold text-lg text-brand-navy mb-2">
                  {usp.title}
                </h3>
                <p className="font-sans text-sm text-brand-grey leading-relaxed">
                  {usp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
