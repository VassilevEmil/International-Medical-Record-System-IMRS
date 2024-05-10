export async function searchInstitution(term: string) {
  const url = `https://imrs-server-12m3e12kdk1k12mek.tech/institutions/search?term=${encodeURIComponent(term)}`;
  
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
