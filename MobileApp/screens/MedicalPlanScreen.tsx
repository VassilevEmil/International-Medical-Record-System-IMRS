import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";

import { fetchDrugRecordsByPatientId  } from '../services/APIservices'




const MedicalPlanScreen= ({ patientId }: { patientId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [drugRecords, setDrugRecords] = useState([]);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchDrugRecords = async () => {
      try {
        const records = await fetchDrugRecordsByPatientId(patientId);
        setDrugRecords(records);
        setIsLoading(false);
      } catch (error) {
       
        setIsLoading(false);
        
      }
    };

    fetchDrugRecords();

    return () => {
    
    };
  }, [patientId]);

  
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error !== null) {
    return <Text>{error}</Text>;
  }


  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <ul>
          {drugRecords.map((record, index) => (
            <li key={index}>{record}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
 

export default MedicalPlanScreen;
 


