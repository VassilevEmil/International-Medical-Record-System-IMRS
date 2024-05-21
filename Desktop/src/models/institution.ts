import { Country } from "../../enums";

export interface InstitutionForDisplay {
  id: string;
  institutionId: string;
  name: string;
  country: Country;
  address: string;
  color: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  photo: string;
  apiKey: string;
}
