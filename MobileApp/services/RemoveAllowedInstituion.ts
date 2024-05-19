export async function removeAllowedInstitution(institutionId: string, patientId: string) {
    const url = `${process.env.API_BASE_URL}/institutions/removeAllowedInstitution`;

    const requestOptions = {
        method: 'POST',
        headers: {
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
