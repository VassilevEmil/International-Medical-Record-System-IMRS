import { Institution } from "../models/institution";

export async function getAllowedInstitutions(patientId: string, page = 1, limit = 10): Promise<Institution[]> {
    const url = `https://imrs-server-12m3e12kdk1k12mek.tech/api/${patientId}?page=${page}&limit=${limit}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const institutions: Institution[] = await response.json();
        return institutions;
    } catch (error) {
        console.error('Error fetching allowed institutions:', error);
        throw error;
    }
}
