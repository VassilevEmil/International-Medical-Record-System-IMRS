export async function searchInstitution(term: string) {
  const url = `${process.env.API_BASE_URL}/institutions/search?term=${encodeURIComponent(term)}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Failed to fetch institutions:', error);
    throw error;
  }
}
