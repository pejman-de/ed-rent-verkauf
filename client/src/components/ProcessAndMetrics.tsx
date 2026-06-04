import { ClipboardCheck, FileCheck2, CalendarRange, KeyRound } from "lucide-react";

export default function ProcessAndMetrics() {
  const steps = [
    {
      num: "01",
      icon: <ClipboardCheck className="h-5 w-5 text-accent" />,
      title: "Bedarf klären",
      desc: "Sie wählen Ihr Fahrzeug aus oder beschreiben uns Ihre Wunsch-Spezifikationen inklusive benötigtem Aufbau."
    },
    {
      num: "02",
      icon: <FileCheck2 className="h-5 w-5 text-accent" />,
      title: "Angebot erhalten",
      desc: "Innerhalb von 24 Stunden erhalten Sie Ihr maßgeschneidertes Kauf- oder Finanzierungsangebot per E-Mail."
    },
    {
      num: "03",
      icon: <CalendarRange className="h-5 w-5 text-accent" />,
      title: "Finanzierung & Vertrag",
      desc: "Wir wickeln die Finanzierung passgenau über die GEFA Bank ab und unterschreiben unkompliziert mit Ihnen."
    },
    {
      num: "04",
      icon: <KeyRound className="h-5 w-5 text-accent" />,
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
    <section className="bg-secondary/30 py-16 lg:py-24 border-b border-muted/10">
      <div className="container space-y-20">
        
        {/* Step 1: 4-Step Process */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-sans text-xs font-bold tracking-wider text-muted uppercase">
              In 4 einfachen Schritten
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
              Ihr Weg zum neuen Nutzfahrzeug.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col p-6 bg-background border border-muted/20 rounded-sm">
                {/* Connecting Line for desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-muted/20 z-10" />
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-secondary text-primary">
                    {step.icon}
                  </div>
                  <span className="font-sans text-xs font-bold text-muted uppercase tracking-wider">
                    Schritt {step.num}
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-base text-primary mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: 4-Column Metric Grid */}
        <div className="pt-12 border-t border-muted/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-accent tracking-tight leading-none">
                  {metric.value}
                </div>
                <div className="font-display font-bold text-sm text-primary">
                  {metric.label}
                </div>
                <p className="font-sans text-xs text-muted max-w-[180px] mx-auto leading-normal">
                  {metric.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
