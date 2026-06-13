export default function SocialProof() {
  const brands = [
    { name: "Mercedes-Benz", desc: "Sprinter & Atego Spezialist" },
    { name: "Iveco", desc: "Daily Box & Fahrgestelle" },
    { name: "MAN", desc: "TGE Kastenwagen" },
    { name: "Fiat Professional", desc: "Ducato Transporter" },
    { name: "Opel", desc: "Movano Cargo Baureihen" }
  ];

  return (
    <section className="bg-brand-light py-12 border-b border-brand-grey/10">
      <div className="container">
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between">
          {/* Header */}
          <div className="max-w-md shrink-0">
            <h2 className="font-display font-bold text-lg text-brand-navy leading-tight">
              Erfahrung mit Fahrzeugen führender Hersteller.
            </h2>
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan mt-1">
              Beste Konditionen & voller Service.
            </p>
          </div>

          {/* Brand List */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 items-center w-full lg:max-w-4xl lg:ml-8">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-brand-grey/15 bg-white shadow-sm hover:shadow-xl hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <span className="font-display font-extrabold text-sm tracking-tight text-brand-navy leading-none">
                  {brand.name}
                </span>
                <span className="font-sans text-[10px] font-semibold text-brand-grey mt-1.5 uppercase tracking-wider">
                  {brand.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
