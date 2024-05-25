import EncryptedStorage from "react-native-encrypted-storage";

export async function searchInstitution(term: string) {
  const url = `https://imrs-server-12m3e12kdk1k12mek.tech/api/institutions/search?term=${encodeURIComponent(term)}`;
  
  try {
    const bearerToken = await EncryptedStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      }
    });

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
