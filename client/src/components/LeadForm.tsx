import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

// 1. Define Zod Validation Schema with conditional logic for Stückzahl & new contact fields
const formSchema = z.object({
  lead_path: z.enum(["einzel", "paket"]),
  fahrzeugtyp: z.string().min(1, "Bitte wählen Sie einen Fahrzeugtyp."),
  condition: z.enum(["Neu", "Gebraucht"]),
  abholung_lieferung: z.enum(["Selbstabholung", "Lieferung"]),
  wunschtermin: z.string().min(1, "Bitte wählen Sie einen Wunschtermin."),
  einsatzregion: z.string().min(5, "Bitte geben Sie eine gültige PLZ oder Region ein."),
  stueckzahl: z.number().int().min(1, "Mindestens 1 Fahrzeug."),
  // New contact fields (removing firma and ansprechpartner)
  vorname: z.string().min(2, "Bitte geben Sie Ihren Vornamen an."),
  nachname: z.string().min(2, "Bitte geben Sie Ihren Nachnamen an."),
  unternehmen: z.string().min(2, "Bitte geben Sie Ihr Unternehmen an."),
  email: z.string().min(1, "Bitte geben Sie Ihre E-Mail-Adresse an.").email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  telefon: z.string().optional(), // Now optional
  // Radio fields
  finanzierung: z.enum(["Ja", "Nein"]),
  aufbau: z.enum(["Ja", "Nein"]),
  // Hidden fields state
  offer_type: z.string(),
  page_variant: z.string(),
}).superRefine((data, ctx) => {
  // Conditional validation: If lead_path is "paket", stueckzahl must be at least 2
  if (data.lead_path === "paket" && data.stueckzahl < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Für eine Paketanfrage geben Sie bitte mindestens 2 Fahrzeuge an.",
      path: ["stueckzahl"],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  prefilledVehicle?: string;
}

export default function LeadForm({ prefilledVehicle }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<"Hot" | "Warm" | "Cold" | null>(null);
  
  // Wizard State
  const [step, setStep] = useState<1 | 2>(1);

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      lead_path: "einzel",
      fahrzeugtyp: prefilledVehicle || "",
      condition: "Neu",
      abholung_lieferung: "Selbstabholung",
      wunschtermin: "",
      einsatzregion: "",
      stueckzahl: 1,
      vorname: "",
      nachname: "",
      unternehmen: "",
      email: "",
      telefon: "",
      finanzierung: "Nein",
      aufbau: "Nein",
      offer_type: "verkauf",
      page_variant: "lp-verkauf",
    },
  });

  // Watch fields for dynamic adjustment & controlled inputs
  const watchLeadPath = watch("lead_path");
  const watchStueckzahl = watch("stueckzahl");
  const watchFahrzeugtyp = watch("fahrzeugtyp");
  const watchCondition = watch("condition");
  const watchAbholungLieferung = watch("abholung_lieferung");
  const watchFinanzierung = watch("finanzierung");
  const watchAufbau = watch("aufbau");

  // Update fahrzeugtyp when prefilledVehicle prop changes & reset to Step 1
  useEffect(() => {
    if (prefilledVehicle) {
      setValue("fahrzeugtyp", prefilledVehicle);
      setStep(1);
    }
  }, [prefilledVehicle, setValue]);

  // Adjust Stückzahl default based on lead path selection (and watch watchStueckzahl)
  useEffect(() => {
    if (watchLeadPath === "paket" && watchStueckzahl < 2) {
      setValue("stueckzahl", 2);
    } else if (watchLeadPath === "einzel" && watchStueckzahl > 1) {
      setValue("stueckzahl", 1);
    }
  }, [watchLeadPath, watchStueckzahl, setValue]);

  // 3. Lead-Scoring Algorithm (Submit Handler)
  const calculateLeadScore = (data: FormValues): "Hot" | "Warm" | "Cold" => {
    try {
      const today = new Date();
      const targetDate = new Date(data.wunschtermin);
      
      // Calculate difference in days
      const diffTime = Math.abs(targetDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Rule 1: Score A (Hot)
      // IF (lead_path == "paket" AND Stückzahl >= 2) OR (Finanzierung gewünscht == "Ja" AND Wunschtermin < 14 days from today)
      if (
        (data.lead_path === "paket" && data.stueckzahl >= 2) ||
        (data.finanzierung === "Ja" && diffDays < 14)
      ) {
        return "Hot";
      }

      // Rule 2: Score B (Warm)
      // IF (lead_path == "einzel" AND Wunschtermin is between 14 and 30 days from today)
      if (
        data.lead_path === "einzel" &&
        diffDays >= 14 &&
        diffDays <= 30
      ) {
        return "Warm";
      }

      // Rule 3: Score C (Cold)
      // No date provided or incomplete payload (fallback)
      return "Cold";
    } catch (e) {
      return "Cold";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Calculate the score
    const score = calculateLeadScore(data);
    setCalculatedScore(score);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Console.log payload & lead score exactly as required
    console.log("=== ED Rent & Sale Lead Submission ===");
    console.log("Lead Score Category:", score);
    console.log("Payload:", {
      ...data,
      lead_score: score,
      submitted_at: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Anfrage erfolgreich übermittelt!");
  };

  // Next Step validation trigger
  const handleNextStep = async () => {
    const valid = await trigger([
      "fahrzeugtyp",
      "wunschtermin",
      "einsatzregion",
      "stueckzahl",
    ]);
    if (valid) {
      setStep(2);
    }
  };

  return (
    <section id="anfrage" className="bg-secondary/30 py-12 md:py-24 border-b border-muted/10 scroll-mt-20">
      <div className="container max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 border border-muted/30 bg-background px-3 py-1 rounded-sm">
            <span className="font-sans text-[10px] md:text-xs font-bold tracking-wider text-primary uppercase">
              Direktanfrage
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-primary tracking-tight">
            Unverbindliches Angebot anfordern.
          </h2>
          <p className="font-sans text-sm md:text-base text-muted leading-relaxed hidden sm:block">
            Teilen Sie uns Ihre Anforderungen mit. Unser B2B-Team meldet sich innerhalb von 24 Stunden mit einem konkreten Angebot bei Ihnen.
          </p>
        </div>
	
        {/* Lead Form Container */}
        <div className="bg-background border border-muted/20 rounded-sm shadow-lg overflow-hidden">
          
          {/* Form Header Info Bar */}
          <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between border-b border-muted/20">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider truncate">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
              <span>B2B-Direktanfrage. 100% DSGVO-konform.</span>
            </div>
            <span className="text-[10px] font-sans text-primary-foreground/60 hidden sm:inline shrink-0">
              Bearbeitungszeit: &lt; 24 Std.
            </span>
          </div>

          {/* Progress Indicator (Fortschrittsanzeige) */}
          {!isSuccess && (
            <div className="bg-secondary/10 px-6 py-4 border-b border-muted/10 flex items-center justify-between gap-4 font-sans text-xs">
              <div className="flex items-center gap-2 md:gap-3 w-full">
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-sm flex items-center justify-center font-bold transition-colors text-[11px] ${
                    step === 1 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-emerald-600 text-white"
                  }`}>
                    {step === 2 ? <CheckCircle2 className="h-4 w-4 stroke-[3]" /> : "1"}
                  </div>
                  <span className={`font-bold ${step === 1 ? "text-primary" : "text-muted-foreground"}`}>
                    Fahrzeug & Konditionen
                  </span>
                </div>

                {/* Line */}
                <div className="flex-grow h-[1px] bg-muted/20" />

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-sm flex items-center justify-center font-bold border transition-colors text-[11px] ${
                    step === 2 
                      ? "bg-accent text-accent-foreground border-accent" 
                      : "bg-secondary text-muted border-muted/20"
                  }`}>
                    2
                  </div>
                  <span className={`font-bold ${step === 2 ? "text-primary" : "text-muted-foreground"}`}>
                    Ihre Kontaktdaten
                  </span>
                </div>
              </div>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-6 md:space-y-8">
              
              {/* STEP 1: VEHICLE & CONDITIONS */}
              {step === 1 && (
                <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
                  {/* Top Level Toggle (Radio Group) */}
                  <div className="space-y-3">
                    <Label className="font-display font-bold text-sm text-primary">Anfrage-Typ</Label>
                <RadioGroup
                  value={watchLeadPath}
                  onValueChange={(val) => setValue("lead_path", val as "einzel" | "paket")}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="r-einzel"
                    className={`flex items-center space-x-3 p-4 border rounded-sm cursor-pointer min-h-[52px] transition-colors ${
                      watchLeadPath === "einzel"
                        ? "border-primary bg-secondary/30"
                        : "border-muted/20 hover:border-muted/40"
                    }`}
                  >
                    <RadioGroupItem value="einzel" id="r-einzel" className="text-primary border-primary shrink-0" />
                    <div className="font-sans font-bold text-sm text-primary flex flex-col">
                      <span>Einzelkauf</span>
                      <span className="text-xs font-normal text-muted mt-0.5">Bedarf an einzelnen Fahrzeugen</span>
                    </div>
                  </Label>

                  <Label
                    htmlFor="r-paket"
                    className={`flex items-center space-x-3 p-4 border rounded-sm cursor-pointer min-h-[52px] transition-colors ${
                      watchLeadPath === "paket"
                        ? "border-primary bg-secondary/30"
                        : "border-muted/20 hover:border-muted/40"
                    }`}
                  >
                    <RadioGroupItem value="paket" id="r-paket" className="text-primary border-primary shrink-0" />
                    <div className="font-sans font-bold text-sm text-primary flex flex-col">
                      <span>Händler / Paketabnahme</span>
                      <span className="text-xs font-normal text-muted mt-0.5">Sonderkonditionen ab mehreren Fahrzeugen</span>
                    </div>
                  </Label>
                </RadioGroup>
                  </div>

                  {/* Main Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Fahrzeugtyp (Select) */}
                    <div className="space-y-2">
                      <Label htmlFor="fahrzeugtyp" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Fahrzeugtyp / Wunschmodell *
                      </Label>
                      <Select
                        value={watchFahrzeugtyp}
                        onValueChange={(val) => setValue("fahrzeugtyp", val)}
                      >
                        <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary">
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-muted/20 rounded-sm">
                          <SelectItem value="Mercedes-Benz Sprinter 317 CDI" className="text-sm md:text-xs font-medium text-primary">Mercedes-Benz Sprinter 317 CDI</SelectItem>
                          <SelectItem value="Iveco Daily 35S18 Box" className="text-sm md:text-xs font-medium text-primary">Iveco Daily 35S18 Box</SelectItem>
                          <SelectItem value="MAN TGE 3.180 Kasten" className="text-sm md:text-xs font-medium text-primary">MAN TGE 3.180 Kasten</SelectItem>
                          <SelectItem value="Fiat Ducato L3H2" className="text-sm md:text-xs font-medium text-primary">Fiat Ducato L3H2</SelectItem>
                          <SelectItem value="Opel Movano Cargo L2H2" className="text-sm md:text-xs font-medium text-primary">Opel Movano Cargo L2H2</SelectItem>
                          <SelectItem value="Mercedes-Benz Atego 1223" className="text-sm md:text-xs font-medium text-primary">Mercedes-Benz Atego 1223</SelectItem>
                          <SelectItem value="Individuelle Spezifikation" className="text-sm md:text-xs font-medium text-primary">Individuelle Spezifikation / Anderes Modell</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.fahrzeugtyp && (
                        <p className="text-xs font-semibold text-destructive">{errors.fahrzeugtyp.message}</p>
                      )}
                    </div>

                    {/* Neu / Gebraucht (Select) */}
                    <div className="space-y-2">
                      <Label className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Zustand
                      </Label>
                      <Select
                        value={watchCondition}
                        onValueChange={(val) => setValue("condition", val as "Neu" | "Gebraucht")}
                      >
                        <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary">
                          <SelectValue placeholder="Zustand wählen" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-muted/20 rounded-sm">
                          <SelectItem value="Neu" className="text-sm md:text-xs font-medium text-primary">Neufahrzeug</SelectItem>
                          <SelectItem value="Gebraucht" className="text-sm md:text-xs font-medium text-primary">Gebrauchtfahrzeug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Abholung oder Lieferung (Select) */}
                    <div className="space-y-2">
                      <Label className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Logistikoption
                      </Label>
                      <Select
                        value={watchAbholungLieferung}
                        onValueChange={(val) => setValue("abholung_lieferung", val as "Selbstabholung" | "Lieferung")}
                      >
                        <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary">
                          <SelectValue placeholder="Logistik wählen" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-muted/20 rounded-sm">
                          <SelectItem value="Selbstabholung" className="text-sm md:text-xs font-medium text-primary">Selbstabholung (Zentrallager)</SelectItem>
                          <SelectItem value="Lieferung" className="text-sm md:text-xs font-medium text-primary">Bundesweite Lieferung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wunschtermin (Date) */}
                    <div className="space-y-2">
                      <Label htmlFor="wunschtermin" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Wunschtermin / Liefertermin *
                      </Label>
                      <Input
                        type="date"
                        id="wunschtermin"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("wunschtermin")}
                      />
                      {errors.wunschtermin && (
                        <p className="text-xs font-semibold text-destructive">{errors.wunschtermin.message}</p>
                      )}
                    </div>

                    {/* Einsatzregion / PLZ (Input) */}
                    <div className="space-y-2">
                      <Label htmlFor="einsatzregion" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Einsatzregion / PLZ *
                      </Label>
                      <Input
                        type="text"
                        id="einsatzregion"
                        placeholder="z.B. 40210 Düsseldorf"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("einsatzregion")}
                      />
                      {errors.einsatzregion && (
                        <p className="text-xs font-semibold text-destructive">{errors.einsatzregion.message}</p>
                      )}
                    </div>

                    {/* Stückzahl (Input / Number) */}
                    <div className="space-y-2">
                      <Label htmlFor="stueckzahl" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Stückzahl *
                      </Label>
                      <Input
                        type="number"
                        id="stueckzahl"
                        min="1"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("stueckzahl", { valueAsNumber: true })}
                      />
                      {errors.stueckzahl && (
                        <p className="text-xs font-semibold text-destructive">{errors.stueckzahl.message}</p>
                      )}
                    </div>

                  </div>

                  {/* Radio/Boolean Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-muted/10">
                    {/* Finanzierung gewünscht? */}
                    <div className="space-y-3">
                      <Label className="font-display font-bold text-sm text-primary">Finanzierung / Leasing gewünscht?</Label>
                      <RadioGroup
                        value={watchFinanzierung}
                        onValueChange={(val) => setValue("finanzierung", val as "Ja" | "Nein")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Ja" id="fin-ja" className="text-primary border-primary shrink-0" />
                          <Label htmlFor="fin-ja" className="font-sans font-semibold text-sm text-primary cursor-pointer">Ja (z.B. GEFA Bank)</Label>
                        </div>
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Nein" id="fin-nein" className="text-primary border-primary shrink-0" />
                          <Label htmlFor="fin-nein" className="font-sans font-semibold text-sm text-primary cursor-pointer">Nein (Kauf)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Aufbau gewünscht? */}
                    <div className="space-y-3">
                      <Label className="font-display font-bold text-sm text-primary">Sonderaufbau benötigt?</Label>
                      <RadioGroup
                        value={watchAufbau}
                        onValueChange={(val) => setValue("aufbau", val as "Ja" | "Nein")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Ja" id="auf-ja" className="text-primary border-primary shrink-0" />
                          <Label htmlFor="auf-ja" className="font-sans font-semibold text-sm text-primary cursor-pointer">Ja (Koffer, Pritsche etc.)</Label>
                        </div>
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Nein" id="auf-nein" className="text-primary border-primary shrink-0" />
                          <Label htmlFor="auf-nein" className="font-sans font-semibold text-sm text-primary cursor-pointer">Nein (Kasten/Standard)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Step 1 CTA Trigger */}
                  <div className="pt-4 sticky bottom-0 left-0 right-0 z-20 -mx-6 px-6 py-3 bg-background border-t border-muted/20 md:static md:mx-0 md:px-0 md:py-0 md:border-0 md:bg-transparent">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-extrabold text-base py-6 rounded-sm shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Weiter zu den Kontaktdaten</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: SENSITIVE PERSONAL CONTACT DETAILS */}
              {step === 2 && (
                <div className="space-y-6 pb-20 md:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Vorname */}
                    <div className="space-y-2">
                      <Label htmlFor="vorname" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Vorname *
                      </Label>
                      <Input
                        type="text"
                        id="vorname"
                        placeholder="z.B. Max"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("vorname")}
                      />
                      {errors.vorname && (
                        <p className="text-xs font-semibold text-destructive">{errors.vorname.message}</p>
                      )}
                    </div>

                    {/* Nachname */}
                    <div className="space-y-2">
                      <Label htmlFor="nachname" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Nachname *
                      </Label>
                      <Input
                        type="text"
                        id="nachname"
                        placeholder="z.B. Mustermann"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("nachname")}
                      />
                      {errors.nachname && (
                        <p className="text-xs font-semibold text-destructive">{errors.nachname.message}</p>
                      )}
                    </div>

                    {/* Unternehmen */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="unternehmen" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Unternehmen *
                      </Label>
                      <Input
                        type="text"
                        id="unternehmen"
                        placeholder="z.B. Firmenname GmbH"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("unternehmen")}
                      />
                      {errors.unternehmen && (
                        <p className="text-xs font-semibold text-destructive">{errors.unternehmen.message}</p>
                      )}
                    </div>

                    {/* E-Mail */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        E-Mail-Adresse *
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="z.B. m.mustermann@firma.de"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Telefon */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="telefon" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                        Telefonnummer (optional)
                      </Label>
                      <Input
                        type="tel"
                        id="telefon"
                        placeholder="z.B. +49 123 456789"
                        className="w-full bg-background border-muted/30 rounded-sm h-12 md:h-11 text-base md:text-xs font-semibold text-primary"
                        {...register("telefon")}
                      />
                      {errors.telefon && (
                        <p className="text-xs font-semibold text-destructive">{errors.telefon.message}</p>
                      )}
                    </div>

                  </div>

                  {/* Step 2 CTA Triggers */}
                  <div className="pt-4 sticky bottom-0 left-0 right-0 z-20 -mx-6 px-6 py-3 bg-background border-t border-muted/20 md:static md:mx-0 md:px-0 md:py-0 md:border-0 md:bg-transparent flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-1/3 border-primary text-primary font-sans font-bold text-base py-6 rounded-sm min-h-[44px] flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span>Zurück</span>
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-2/3 bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-extrabold text-base py-6 rounded-sm shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Anfrage wird gesendet...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Anfrage absenden</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="font-sans text-[10px] text-muted text-center mt-3 leading-normal">
                    Mit Absenden des Formulars stimmen Sie der Verarbeitung Ihrer Daten zur Angebotserstellung gemäß unserer Datenschutzerklärung zu. Keine Werbe-Spam-Garantie.
                  </p>
                </div>
              )}

            </form>
          ) : (
            // Success State
            <div className="p-10 md:p-16 text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
                <CheckCircle2 className="h-10 w-10 text-accent stroke-[3]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-primary">Vielen Dank für Ihre Anfrage!</h3>
                <p className="font-sans text-base text-muted max-w-lg mx-auto">
                  Ihre Nutzfahrzeug-Anfrage wurde erfolgreich übermittelt. Unser B2B-Spezialist prüft Ihre Daten und erstellt Ihr Angebot.
                </p>
              </div>

              {/* Display lead score details dynamically for professional demonstration */}
              <div className="border border-muted/20 bg-secondary/30 p-4 rounded-sm max-w-md mx-auto text-left space-y-2 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-muted font-semibold">Anfrage-Status:</span>
                  <span className="text-primary font-bold">Erfolgreich erfasst</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-semibold">Priorität (Lead Score):</span>
                  <span className={`font-bold ${
                    calculatedScore === "Hot" ? "text-red-600" : calculatedScore === "Warm" ? "text-orange-500" : "text-blue-600"
                  }`}>
                    {calculatedScore === "Hot" ? "Sehr hoch (Hot)" : calculatedScore === "Warm" ? "Hoch (Warm)" : "Standard (Cold)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-semibold">Geschätzte Rückmeldezeit:</span>
                  <span className="text-primary font-bold">
                    {calculatedScore === "Hot" ? "< 4 Stunden" : calculatedScore === "Warm" ? "< 12 Stunden" : "< 24 Stunden"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setStep(1);
                    reset();
                  }}
                  variant="outline"
                  className="font-sans font-bold text-xs border-primary text-primary rounded-sm"
                >
                  Neue Anfrage starten
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
