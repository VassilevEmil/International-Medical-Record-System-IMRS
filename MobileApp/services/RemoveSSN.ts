const apiUrl = `${process.env.API_BASE_URL}/ssn/deleteSSN`;

export async function deleteSSN(patientId: string, ssn: string): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/${patientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ssn }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete SSN");
    }
  } catch (error) {
    console.error("Error deleting SSN:", error);
    throw error;
  }
}
