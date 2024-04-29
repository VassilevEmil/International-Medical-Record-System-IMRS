import { Country } from "../enums";

export interface Institution {
    id: string,
    institutionId: string,
    name: string,
    country: Country,
    address: string,
}