export async function addAllowedInstitution(institutionId: string, patientId: string ) {
    const url = `https://imrs-server-12m3e12kdk1k12mek.tech/institutions/addAllowedInstitution`;

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