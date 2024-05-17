export enum Language {
  English = "EN",
  Danish = "DK",
  Lithuanian = "LT",
  Bulgarian = "BG",
}

export enum TypeOfRecord {
  Diagnosis = "DIAGNOSIS",
  GeneralVisit = "GENERAL_VISIT",
  Bloodwork = "BLOODWORK",
  MedicalImaging = "MEDICAL_IMAGING",
  Prescription = "PRESCRIPTION",
  Other = "Other",
}

export enum Country {
  Denmark = "DENMARK",
  Lithuania = "LITHUANIA",
  Bulgaria = "BULGARIA",
}

export enum DurationType {
  Days = "DAYS",
  Weeks = "WEEKS",
  Months = "MONTHS",
  Years = "YEARS",
  Indefinetely = "INDEFINETELY",
}

interface PrettyPrintMap {
  [key: string]: string;
}
// Used for printing nice in the front end. 
// Otherwise we would pring things like "GENERAL_VISIT"
const prettyPrint: PrettyPrintMap = {
  EN: "English",
  DK: "Danish",
  LT: "Lithuanian",
  BG: "Bulgarian",
  DIAGNOSIS: "Diagnosis",
  GENERAL_VISIT: "General Visit",
  BLOODWORK: "Bloodwork",
  MEDICAL_IMAGING: "Medical Imaging",
  PRESCRIPTION: "Prescription",
  Other: "Other",
  DENMARK: "Denmark",
  LITHUANIA: "Lithuania",
  BULGARIA: "Bulgaria",
  DAYS: "Days",
  WEEKS: "Weeks",
  MONTHS: "Months",
  YEARS: "Years",
  INDEFINETELY: "Indefinitely",
};

type EnumValues = Language | TypeOfRecord | Country | DurationType;

export function formatEnumValue(value: EnumValues): string {
  const key = String(value);
  return prettyPrint[key] || key;
}
