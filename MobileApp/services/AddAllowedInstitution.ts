export async function addAllowedInstitution(institutionId: string, patientId: string ) {
    const url = `${process.env.API_BASE_URL}/institutions/addAllowedInstitution`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patientId, institutionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to add institution. Network response was not ok.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Could not add institution to allowed list:', error);
        throw new Error("Could not add institution to allowed list");
    }
}