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

// 1. Define Zod Validation Schema with conditional logic for Stückzahl & new contact fields & hidden fields
const formSchema = z.object({
  lead_path: z.enum(["einzel", "paket"]),
  fahrzeugtyp: z.string().min(1, "Bitte wählen Sie einen Fahrzeugtyp."),
  condition: z.enum(["Neu", "Gebraucht"]),
  abholung_lieferung: z.enum(["Selbstabholung", "Lieferung"]),
  wunschtermin: z.string().min(1, "Bitte wählen Sie einen Wunschtermin."),
  einsatzregion: z.string().min(5, "Bitte geben Sie eine gültige PLZ oder Region ein."),
  stueckzahl: z.number().int().min(1, "Mindestens 1 Fahrzeug."),
  vorname: z.string().min(2, "Bitte geben Sie Ihren Vornamen an."),
  nachname: z.string().min(2, "Bitte geben Sie Ihren Nachnamen an."),
  unternehmen: z.string().min(2, "Bitte geben Sie Ihr Unternehmen an."),
  email: z.string().min(1, "Bitte geben Sie Ihre E-Mail-Adresse an.").email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  telefon: z.string().optional(),
  finanzierung: z.enum(["Ja", "Nein"]),
  aufbau: z.enum(["Ja", "Nein"]),
  // Hidden fields state
  offer_type: z.string(),
  page_variant: z.string(),
  // UTM parameters
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
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
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
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

  // Read UTM parameters from URL on mount and set them
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setValue("utm_source", params.get("utm_source") || "");
      setValue("utm_medium", params.get("utm_medium") || "");
      setValue("utm_campaign", params.get("utm_campaign") || "");
      setValue("utm_term", params.get("utm_term") || "");
      setValue("utm_content", params.get("utm_content") || "");
    }
  }, [setValue]);

  // Update fahrzeugtyp when prefilledVehicle prop changes & reset to Step 1
  useEffect(() => {
    if (prefilledVehicle) {
      setValue("fahrzeugtyp", prefilledVehicle);
      setStep(1);
    }
  }, [prefilledVehicle, setValue]);

  // Adjust Stückzahl default based on lead path selection
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
      if (
        (data.lead_path === "paket" && data.stueckzahl >= 2) ||
        (data.finanzierung === "Ja" && diffDays < 14)
      ) {
        return "Hot";
      }

      // Rule 2: Score B (Warm)
      if (
        data.lead_path === "einzel" &&
        diffDays >= 14 &&
        diffDays <= 30
      ) {
        return "Warm";
      }

      // Rule 3: Score C (Cold)
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
    <section id="anfrage" className="relative overflow-hidden bg-brand-light py-20 border-b border-brand-grey/10 scroll-mt-20">
      {/* Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6e7c950a_1px,transparent_1px),linear-gradient(to_bottom,#6e7c950a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container relative z-10 max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-cyan">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan">
              Direktanfrage
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
            Unverbindliches Angebot anfordern.
          </h2>
          <p className="font-sans text-base text-brand-grey leading-relaxed">
            Teilen Sie uns Ihre Anforderungen mit. Unser B2B-Team meldet sich innerhalb von 24 Stunden mit einem konkreten Angebot bei Ihnen.
          </p>
        </div>
		
        {/* Lead Form Container */}
        <div className="bg-white border border-brand-grey/15 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Form Header Info Bar */}
          <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between border-b border-brand-grey/15 relative overflow-hidden">
            {/* Mini Tech-Grid on header */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            <div className="relative z-10 flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider truncate">
              <ShieldCheck className="h-4 w-4 text-brand-cyan shrink-0" />
              <span>B2B-Direktanfrage. 100% DSGVO-konform.</span>
            </div>
            <span className="relative z-10 text-xs font-sans text-white/60 hidden sm:inline shrink-0">
              Bearbeitungszeit: &lt; 24 Std.
            </span>
          </div>

          {/* Progress Indicator */}
          {!isSuccess && (
            <div className="bg-brand-light px-6 py-4 border-b border-brand-grey/15 flex items-center justify-between gap-4 font-sans text-xs">
              <div className="flex items-center gap-2 md:gap-3 w-full">
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold transition-colors text-[11px] ${
                    step === 1 
                      ? "bg-brand-cyan text-brand-navy" 
                      : "bg-emerald-600 text-white"
                  }`}>
                    {step === 2 ? <CheckCircle2 className="h-4 w-4 stroke-[3]" /> : "1"}
                  </div>
                  <span className={`font-bold ${step === 1 ? "text-brand-navy" : "text-brand-grey"}`}>
                    Fahrzeug & Konditionen
                  </span>
                </div>

                {/* Line */}
                <div className="flex-grow h-[1px] bg-brand-grey/15" />

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold border transition-colors text-[11px] ${
                    step === 2 
                      ? "bg-brand-cyan text-brand-navy border-brand-cyan" 
                      : "bg-brand-light text-brand-grey border-brand-grey/15"
                  }`}>
                    2
                  </div>
                  <span className={`font-bold ${step === 2 ? "text-brand-navy" : "text-brand-grey"}`}>
                    Ihre Kontaktdaten
                  </span>
                </div>
              </div>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-6 md:space-y-8">
              {/* Hidden UTM fields */}
              <input type="hidden" {...register("offer_type")} />
              <input type="hidden" {...register("page_variant")} />
              <input type="hidden" {...register("utm_source")} />
              <input type="hidden" {...register("utm_medium")} />
              <input type="hidden" {...register("utm_campaign")} />
              <input type="hidden" {...register("utm_term")} />
              <input type="hidden" {...register("utm_content")} />
              
              {/* STEP 1: VEHICLE & CONDITIONS */}
              {step === 1 && (
                <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
                  {/* Top Level Toggle */}
                  <div className="space-y-3">
                    <Label className="font-display font-bold text-sm text-brand-navy">Anfrage-Typ</Label>
                    <RadioGroup
                      value={watchLeadPath}
                      onValueChange={(val) => setValue("lead_path", val as "einzel" | "paket")}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <Label
                        htmlFor="r-einzel"
                        className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer min-h-[52px] transition-all duration-200 ${
                          watchLeadPath === "einzel"
                            ? "border-brand-cyan bg-brand-cyan/5 shadow-md shadow-brand-cyan/5"
                            : "border-brand-grey/15 hover:border-brand-grey/30 bg-white"
                        }`}
                      >
                        <RadioGroupItem value="einzel" id="r-einzel" className="text-brand-cyan border-brand-grey/30 shrink-0" />
                        <div className="font-sans font-bold text-sm text-brand-navy flex flex-col">
                          <span>Einzelkauf</span>
                          <span className="text-xs font-normal text-brand-grey mt-0.5">Bedarf an einzelnen Fahrzeugen</span>
                        </div>
                      </Label>

                      <Label
                        htmlFor="r-paket"
                        className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer min-h-[52px] transition-all duration-200 ${
                          watchLeadPath === "paket"
                            ? "border-brand-cyan bg-brand-cyan/5 shadow-md shadow-brand-cyan/5"
                            : "border-brand-grey/15 hover:border-brand-grey/30 bg-white"
                        }`}
                      >
                        <RadioGroupItem value="paket" id="r-paket" className="text-brand-cyan border-brand-grey/30 shrink-0" />
                        <div className="font-sans font-bold text-sm text-brand-navy flex flex-col">
                          <span>Händler / Paketabnahme</span>
                          <span className="text-xs font-normal text-brand-grey mt-0.5">Sonderkonditionen ab mehreren Fahrzeugen</span>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  {/* Main Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Fahrzeugtyp */}
                    <div className="space-y-2">
                      <Label htmlFor="fahrzeugtyp" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Fahrzeugtyp / Wunschmodell *
                      </Label>
                      <Select
                        value={watchFahrzeugtyp}
                        onValueChange={(val) => setValue("fahrzeugtyp", val)}
                      >
                        <SelectTrigger className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy">
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-brand-grey/15 rounded-xl">
                          <SelectItem value="Mercedes-Benz Sprinter 317 CDI" className="text-sm font-medium text-brand-navy">Mercedes-Benz Sprinter 317 CDI</SelectItem>
                          <SelectItem value="Iveco Daily 35S18 Box" className="text-sm font-medium text-brand-navy">Iveco Daily 35S18 Box</SelectItem>
                          <SelectItem value="MAN TGE 3.180 Kasten" className="text-sm font-medium text-brand-navy">MAN TGE 3.180 Kasten</SelectItem>
                          <SelectItem value="Fiat Ducato L3H2" className="text-sm font-medium text-brand-navy">Fiat Ducato L3H2</SelectItem>
                          <SelectItem value="Opel Movano Cargo L2H2" className="text-sm font-medium text-brand-navy">Opel Movano Cargo L2H2</SelectItem>
                          <SelectItem value="Mercedes-Benz Atego 1223" className="text-sm font-medium text-brand-navy">Mercedes-Benz Atego 1223</SelectItem>
                          <SelectItem value="Individuelle Spezifikation" className="text-sm font-medium text-brand-navy">Individuelle Spezifikation / Anderes Modell</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.fahrzeugtyp && (
                        <p className="text-xs font-semibold text-destructive">{errors.fahrzeugtyp.message}</p>
                      )}
                    </div>

                    {/* Zustand */}
                    <div className="space-y-2">
                      <Label htmlFor="condition" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Zustand *
                      </Label>
                      <Select
                        value={watchCondition}
                        onValueChange={(val) => setValue("condition", val as "Neu" | "Gebraucht")}
                      >
                        <SelectTrigger className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy">
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-brand-grey/15 rounded-xl">
                          <SelectItem value="Neu" className="text-sm font-medium text-brand-navy">Neufahrzeug</SelectItem>
                          <SelectItem value="Gebraucht" className="text-sm font-medium text-brand-navy">Gebrauchtfahrzeug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Stückzahl */}
                    <div className="space-y-2">
                      <Label htmlFor="stueckzahl" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Stückzahl *
                      </Label>
                      <Input
                        type="number"
                        id="stueckzahl"
                        min={watchLeadPath === "paket" ? 2 : 1}
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("stueckzahl", { valueAsNumber: true })}
                      />
                      {errors.stueckzahl && (
                        <p className="text-xs font-semibold text-destructive">{errors.stueckzahl.message}</p>
                      )}
                    </div>

                    {/* Wunschtermin */}
                    <div className="space-y-2">
                      <Label htmlFor="wunschtermin" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Wunschtermin für Übergabe *
                      </Label>
                      <Input
                        type="date"
                        id="wunschtermin"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("wunschtermin")}
                      />
                      {errors.wunschtermin && (
                        <p className="text-xs font-semibold text-destructive">{errors.wunschtermin.message}</p>
                      )}
                    </div>

                    {/* Logistikoption */}
                    <div className="space-y-2">
                      <Label htmlFor="abholung_lieferung" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Logistikoption *
                      </Label>
                      <Select
                        value={watchAbholungLieferung}
                        onValueChange={(val) => setValue("abholung_lieferung", val as "Selbstabholung" | "Lieferung")}
                      >
                        <SelectTrigger className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy">
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-brand-grey/15 rounded-xl">
                          <SelectItem value="Selbstabholung" className="text-sm font-medium text-brand-navy">Selbstabholung (Standort Leichlingen)</SelectItem>
                          <SelectItem value="Lieferung" className="text-sm font-medium text-brand-navy">Lieferung (Direkt zu Ihrem Betriebshof)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Einsatzregion / PLZ */}
                    <div className="space-y-2">
                      <Label htmlFor="einsatzregion" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Einsatzregion / PLZ *
                      </Label>
                      <Input
                        type="text"
                        id="einsatzregion"
                        placeholder="z.B. 42799 oder Köln"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("einsatzregion")}
                      />
                      {errors.einsatzregion && (
                        <p className="text-xs font-semibold text-destructive">{errors.einsatzregion.message}</p>
                      )}
                    </div>

                  </div>

                  {/* Radio fields for Finanzierung & Aufbau */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-brand-grey/10">
                    {/* Finanzierung */}
                    <div className="space-y-3">
                      <Label className="font-display font-bold text-sm text-brand-navy">Finanzierungs- / Leasingangebot erwünscht?</Label>
                      <RadioGroup
                        value={watchFinanzierung}
                        onValueChange={(val) => setValue("finanzierung", val as "Ja" | "Nein")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Ja" id="fin-ja" className="text-brand-cyan border-brand-grey/30 shrink-0" />
                          <Label htmlFor="fin-ja" className="font-sans font-semibold text-sm text-brand-navy cursor-pointer">Ja (GEFA Bank Partner)</Label>
                        </div>
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Nein" id="fin-nein" className="text-brand-cyan border-brand-grey/30 shrink-0" />
                          <Label htmlFor="fin-nein" className="font-sans font-semibold text-sm text-brand-navy cursor-pointer">Nein (Eigenmittel)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Sonderaufbau */}
                    <div className="space-y-3">
                      <Label className="font-display font-bold text-sm text-brand-navy">Sonderaufbau benötigt?</Label>
                      <RadioGroup
                        value={watchAufbau}
                        onValueChange={(val) => setValue("aufbau", val as "Ja" | "Nein")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Ja" id="auf-ja" className="text-brand-cyan border-brand-grey/30 shrink-0" />
                          <Label htmlFor="auf-ja" className="font-sans font-semibold text-sm text-brand-navy cursor-pointer">Ja (Koffer, Pritsche etc.)</Label>
                        </div>
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <RadioGroupItem value="Nein" id="auf-nein" className="text-brand-cyan border-brand-grey/30 shrink-0" />
                          <Label htmlFor="auf-nein" className="font-sans font-semibold text-sm text-brand-navy cursor-pointer">Nein (Kasten/Standard)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Step 1 CTA Trigger */}
                  <div className="pt-4 sticky bottom-0 left-0 right-0 z-20 -mx-6 px-6 py-3 bg-white border-t border-brand-grey/15 md:static md:mx-0 md:px-0 md:py-0 md:border-0 md:bg-transparent">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-brand-cyan text-brand-navy hover:bg-brand-cyan/90 font-bold text-base py-6 rounded-xl shadow-lg shadow-brand-cyan/10 hover:shadow-brand-cyan/20 transition-all active:scale-97 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                    >
                      <span>Weiter zu den Kontaktdaten</span>
                      <ArrowRight className="h-5 w-5 text-brand-navy" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL CONTACT DETAILS */}
              {step === 2 && (
                <div className="space-y-6 pb-20 md:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Vorname */}
                    <div className="space-y-2">
                      <Label htmlFor="vorname" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Vorname *
                      </Label>
                      <Input
                        type="text"
                        id="vorname"
                        placeholder="z.B. Max"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("vorname")}
                      />
                      {errors.vorname && (
                        <p className="text-xs font-semibold text-destructive">{errors.vorname.message}</p>
                      )}
                    </div>

                    {/* Nachname */}
                    <div className="space-y-2">
                      <Label htmlFor="nachname" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Nachname *
                      </Label>
                      <Input
                        type="text"
                        id="nachname"
                        placeholder="z.B. Mustermann"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("nachname")}
                      />
                      {errors.nachname && (
                        <p className="text-xs font-semibold text-destructive">{errors.nachname.message}</p>
                      )}
                    </div>

                    {/* Unternehmen */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="unternehmen" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Unternehmen *
                      </Label>
                      <Input
                        type="text"
                        id="unternehmen"
                        placeholder="z.B. Firmenname GmbH"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("unternehmen")}
                      />
                      {errors.unternehmen && (
                        <p className="text-xs font-semibold text-destructive">{errors.unternehmen.message}</p>
                      )}
                    </div>

                    {/* E-Mail */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        E-Mail-Adresse *
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="z.B. m.mustermann@firma.de"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Telefon */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="telefon" className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider">
                        Telefonnummer (optional)
                      </Label>
                      <Input
                        type="tel"
                        id="telefon"
                        placeholder="z.B. +49 123 456789"
                        className="w-full bg-white border-brand-grey/15 rounded-xl h-12 text-base md:text-sm font-semibold text-brand-navy"
                        {...register("telefon")}
                      />
                      {errors.telefon && (
                        <p className="text-xs font-semibold text-destructive">{errors.telefon.message}</p>
                      )}
                    </div>

                  </div>

                  {/* Step 2 CTA Triggers */}
                  <div className="pt-4 sticky bottom-0 left-0 right-0 z-20 -mx-6 px-6 py-3 bg-white border-t border-brand-grey/15 md:static md:mx-0 md:px-0 md:py-0 md:border-0 md:bg-transparent flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-1/3 border-brand-navy text-brand-navy font-bold text-base py-6 rounded-xl min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="h-5 w-5 text-brand-navy" />
                      <span>Zurück</span>
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-2/3 bg-brand-cyan text-brand-navy hover:bg-brand-cyan/90 font-bold text-base py-6 rounded-xl shadow-lg shadow-brand-cyan/10 hover:shadow-brand-cyan/20 transition-all active:scale-97 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin text-brand-navy" />
                          <span>Anfrage wird gesendet...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 text-brand-navy" />
                          <span>Anfrage absenden</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="font-sans text-[10px] text-brand-grey text-center mt-3 leading-normal">
                    Mit Absenden des Formulars stimmen Sie der Verarbeitung Ihrer Daten zur Angebotserstellung gemäß unserer Datenschutzerklärung zu. Keine Werbe-Spam-Garantie.
                  </p>
                </div>
              )}

            </form>
          ) : (
            // Success State
            <div className="p-10 md:p-16 text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand-navy">
                <CheckCircle2 className="h-10 w-10 text-brand-cyan stroke-[3]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-brand-navy">Vielen Dank für Ihre Anfrage!</h3>
                <p className="font-sans text-base text-brand-grey max-w-lg mx-auto">
                  Ihre Nutzfahrzeug-Anfrage wurde erfolgreich übermittelt. Unser B2B-Spezialist prüft Ihre Daten und erstellt Ihr Angebot.
                </p>
              </div>

              {/* Display lead score details */}
              <div className="border border-brand-grey/15 bg-brand-light p-4 rounded-xl max-w-md mx-auto text-left space-y-2 font-sans text-xs shadow-sm">
                <div className="flex justify-between">
                  <span className="text-brand-grey font-semibold">Anfrage-Status:</span>
                  <span className="text-brand-navy font-bold">Erfolgreich erfasst</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-grey font-semibold">Priorität (Lead Score):</span>
                  <span className={`font-bold ${
                    calculatedScore === "Hot" ? "text-red-600" : calculatedScore === "Warm" ? "text-orange-500" : "text-blue-600"
                  }`}>
                    {calculatedScore === "Hot" ? "Sehr hoch (Hot)" : calculatedScore === "Warm" ? "Hoch (Warm)" : "Standard (Cold)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-grey font-semibold">Geschätzte Rückmeldezeit:</span>
                  <span className="text-brand-navy font-bold">
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
                  className="font-sans font-bold text-xs border-brand-navy text-brand-navy rounded-xl cursor-pointer"
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
