import { Doctor } from "./doctors";

export interface Patient {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    sex: 'M' | 'F';    
    age: number;
    mainDoctor: Doctor;
}

export const patients: Patient[] = [];
