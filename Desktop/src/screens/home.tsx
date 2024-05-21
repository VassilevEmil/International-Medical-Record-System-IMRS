import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  ButtonBase,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { Country } from "../../enums";
import { InstitutionForDisplay } from "../models/institution";
import { getPatientData } from "../services/GetPatientData";
import { useAppContext } from "../context/AppContext";
import { PatientData } from "../models/patientData";

import photo1 from "../assets/doctor1.png";
import photo2 from "../assets/doctor2.png";
import photo3 from "../assets/doctor3.png";

export const institutions: InstitutionForDisplay[] = [
  {
    id: "1",
    institutionId: import.meta.env.VITE_API_INST1_ID,
    name: "City Hospital-Targovishte",
    country: Country.Bulgaria,
    address: "Zapad 2, кв. Запад, 7705 Targovishte",
    color: "#FF6347",
    doctorId: "D001",
    doctorFirstName: "Boris",
    doctorLastName: "Ivanov",
    photo: photo1,
    apiKey: import.meta.env.VITE_API_INST1_KEY,
  },
  {
    id: "2",
    institutionId: import.meta.env.VITE_API_INST2_ID,
    name: "Odense University Hospital",
    country: Country.Denmark,
    address: "J. B. Winsløws Vej 4, 5000 Odense",
    color: "#4682B4",
    doctorId: "D002",
    doctorFirstName: "Peter",
    doctorLastName: "Nielsen",
    photo: photo2,
    apiKey: import.meta.env.VITE_API_INST2_KEY,
  },
  {
    id: "3",
    institutionId: import.meta.env.VITE_API_INST3_ID,
    name: "LSMU Kauno Ligonine",
    country: Country.Lithuania,
    address: "Hipodromo g. 13, Kaunas, 45130 Kauno m. sav.",
    color: "#32CD32",
    doctorId: "D003",
    doctorFirstName: "Natasha",
    doctorLastName: "Rimkienė",
    photo: photo3,
    apiKey: import.meta.env.VITE_API_INST3_KEY,
  },
];

const HomeScreen: React.FC = () => {
  const { setSelectedInstitution, setPatientData, selectedInstitution } =
    useAppContext();
  const [ssn, setSsn] = useState("");
  const [localPatientData, setLocalPatientData] = useState<PatientData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInstitutionClick = (institution: InstitutionForDisplay) => {
    setSelectedInstitution(institution);
  };

  const handleSearch = async () => {
    setError("");
    setLocalPatientData(null);
    setIsLoading(true);
    try {
      if (selectedInstitution) {
        const data = await getPatientData(
          ssn,
          selectedInstitution.apiKey,
          selectedInstitution.institutionId
        );
        setLocalPatientData(data);
      } else {
        setError("No institution selected");
      }
    } catch (error) {
      setError("Patient not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && selectedInstitution) {
      handleSearch();
    }
  };

  const handlePatientSelect = () => {
    if (localPatientData) {
      setPatientData(localPatientData);
    }
  };

  return (
    <Container maxWidth="md">
      <Box>
        <Typography
          variant="h2"
          component="div"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Mock EHRS System
        </Typography>
        {institutions.map((institution) => (
          <ButtonBase
            key={institution.id}
            onClick={() => handleInstitutionClick(institution)}
            sx={{ width: "100%", marginBottom: 2, textAlign: "left" }}
          >
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderLeft: `10px solid ${institution.color}`,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="svg"
                  viewBox="0 0 430 430"
                  sx={{
                    width: 50,
                    height: 50,
                    marginRight: 2,
                  }}
                >
                  <rect width="430" height="430" rx="100" fill="#fff" />
                  <rect
                    id="CrossCollorDiagonal"
                    x="130"
                    y="50"
                    width="170"
                    height="330"
                    rx="20"
                    fill={institution.color}
                  />
                  <rect
                    id="CrossCollorHorizontal"
                    x="130"
                    y="50"
                    width="170"
                    height="330"
                    rx="20"
                    transform="translate(1.75 430) rotate(-90)"
                    fill={institution.color}
                  />
                  <rect
                    id="CrossMiddleHorizontal"
                    x="180"
                    y="100"
                    width="70"
                    height="230"
                    fill="#fff"
                  />
                  <rect
                    id="CrossMiddleDiagonal"
                    x="180"
                    y="100"
                    width="70"
                    height="230"
                    transform="translate(1.75 430) rotate(-90)"
                    fill="#fff"
                  />
                </Box>
                <Box>
                  <Typography variant="body1">{institution.name}</Typography>
                  <Typography variant="body2">{institution.address}</Typography>
                  <Typography variant="body2">{institution.country}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginRight: 2 }}>
                  <Typography variant="body1">
                    {institution.doctorFirstName} {institution.doctorLastName}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={institution.photo}
                  alt={`${institution.doctorFirstName} ${institution.doctorLastName}`}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "40%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Paper>
          </ButtonBase>
        ))}
        <Box
          mt={3}
          mb={4}
          width="100%"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TextField
            label="Enter Patient SSN"
            variant="outlined"
            fullWidth
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSearch}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "#fff",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    disabled={!selectedInstitution}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {!selectedInstitution && (
          <Typography color="error" mt={2}>
            Please select an institution before searching for a patient.
          </Typography>
        )}
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
        {localPatientData && (
          <Paper
            sx={{
              padding: 2,
              marginTop: 1,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handlePatientSelect}
          >
            <Avatar sx={{ backgroundColor: "primary.main", marginRight: 2 }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="h6">
              {localPatientData.patientFirstName}{" "}
              {localPatientData.patientLastName}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default HomeScreen;
