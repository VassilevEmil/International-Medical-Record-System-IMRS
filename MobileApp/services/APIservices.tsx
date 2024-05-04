import axios from 'axios';


const BASE_URL = 'https://127.0.0.1:3000';

export const fetchDrugRecordsByPatientId = async (patientId: string) => {
    try{
        const records = await axios.get(`${BASE_URL}/drug-records/getAllDrugRecords/${patientId}`);

        console.log('recooooooooords: ', records);
        

        return records.data;
} catch (error) {
    console.error('Error fetching drug records', error);
    throw error;
};
}