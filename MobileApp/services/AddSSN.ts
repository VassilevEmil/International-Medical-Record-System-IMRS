const apiUrl = "https://imrs-server-12m3e12kdk1k12mek.tech/ssn";

export async function addSSN(
  patientId: string,
  ssn: string,
  country: string
): Promise<void> {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId, ssn, country }),
    });

    if (!response.ok) {
      throw new Error("Failed to add SSN");
    }
  } catch (error) {
    console.error("Error adding SSN:", error);
    throw error;
  }
}
