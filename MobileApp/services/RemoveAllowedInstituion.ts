import EncryptedStorage from "react-native-encrypted-storage";

export async function removeAllowedInstitution(institutionId: string, patientId: string) {
    const url = `https://imrs-server-12m3e12kdk1k12mek.tech/api/institutions/removeAllowedInstitution`;
    
    const bearerToken = await EncryptedStorage.getItem("token");
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId, institutionId }),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove institution: ${errorText}`);
    }

    console.log("Allowed institution removed successfully. " + patientId + " / " + institutionId);
}
