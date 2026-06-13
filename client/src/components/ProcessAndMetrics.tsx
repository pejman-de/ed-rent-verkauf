import { ClipboardCheck, FileCheck2, CalendarRange, KeyRound } from "lucide-react";

export default function ProcessAndMetrics() {
  const steps = [
    {
      num: "01",
      icon: <ClipboardCheck className="h-5 w-5 text-brand-navy" />,
      title: "Bedarf klären",
      desc: "Sie wählen Ihr Fahrzeug aus oder beschreiben uns Ihre Wunsch-Spezifikationen inklusive benötigtem Aufbau."
    },
    {
      num: "02",
      icon: <FileCheck2 className="h-5 w-5 text-brand-navy" />,
      title: "Angebot erhalten",
      desc: "Innerhalb von 24 Stunden erhalten Sie Ihr maßgeschneidertes Kauf- oder Finanzierungsangebot per E-Mail."
    },
    {
      num: "03",
      icon: <CalendarRange className="h-5 w-5 text-brand-navy" />,
      title: "Finanzierung & Vertrag",
      desc: "Wir wickeln die Finanzierung passgenau über die GEFA Bank ab und unterschreiben unkompliziert mit Ihnen."
    },
    {
      num: "04",
      icon: <KeyRound className="h-5 w-5 text-brand-navy" />,
      title: "Übergabe / Lieferung",
      desc: "Ihr fahrbereites Nutzfahrzeug wird zur Abholung bereitgestellt oder termingerecht direkt zu Ihnen geliefert."
    }
  ];

  const metrics = [
    {
      value: "24h",
      label: "Angebotsgarantie",
      desc: "Präzises Angebot in Rekordzeit."
    },
    {
      value: "Vor Ort",
      label: "Persönlicher Service",
      desc: "Beratung & Übergabe direkt bei Ihnen."
    },
    {
      value: "GEFA Partner",
      label: "Starke Finanzierung",
      desc: "Top-Konditionen für Gewerbe."
    },
    {
      value: "+ Aufbau",
      label: "Sonderaufbauten",
      desc: "Koffer, Pritsche & Plane nach Maß."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-brand-light py-20 border-b border-brand-grey/10">
      {/* Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6e7c950a_1px,transparent_1px),linear-gradient(to_bottom,#6e7c950a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container relative z-10 space-y-20">
        
        {/* Step 1: 4-Step Process */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan">
              In 4 einfachen Schritten
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
              Ihr Weg zum neuen Nutzfahrzeug.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="group relative flex flex-col justify-between p-8 rounded-2xl border border-brand-grey/15 bg-white shadow-sm hover:shadow-xl hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300">
                {/* Connecting Line for desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-brand-grey/15 z-10" />
                )}
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                      {step.icon}
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-navy text-xs font-bold">
                      {step.num}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-bold text-base text-brand-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-brand-grey leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: 4-Column Metric Grid (Navy Sektion, KPI-Glas-Karten) */}
        <div className="pt-16 border-t border-brand-grey/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col p-6 rounded-2xl border border-brand-navy/10 bg-brand-navy text-white relative overflow-hidden shadow-md">
                {/* Mini Tech-Grid on KPI card */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem]" />
                <div className="relative z-10 space-y-2 text-center">
                  <div className="font-display font-extrabold text-4xl md:text-5xl text-brand-cyan tracking-tight leading-none">
                    {metric.value}
                  </div>
                  <div className="font-display font-bold text-sm text-white">
                    {metric.label}
                  </div>
                  <p className="font-sans text-xs text-white/70 max-w-[180px] mx-auto leading-normal">
                    {metric.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
