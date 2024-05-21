import React, { createContext, useContext, useState } from "react";
import { InstitutionForDisplay } from "../models/institution";
import { PatientData } from "../models/patientData";

interface AppContextProps {
  selectedInstitution: InstitutionForDisplay | null;
  setSelectedInstitution: React.Dispatch<
    React.SetStateAction<InstitutionForDisplay | null>
  >;
  patientData: PatientData | null;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData | null>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitutionForDisplay | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedInstitution,
        setSelectedInstitution,
        patientData,
        setPatientData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
