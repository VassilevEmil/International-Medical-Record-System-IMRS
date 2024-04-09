import React from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import PersonIcon from "@mui/icons-material/Person";

type RecordType = {
  id: number;
  patientName: string;
  dateOfVisit: string;
  diagnosis: string;
  treatment: string;
};

// Dummy data for sim
const records: RecordType[] = [
  {
    id: 1,
    patientName: "HENRY hhans",
    dateOfVisit: "2023-01-01",
    diagnosis: "Flu",
    treatment: "Rest and hydration",
  },
  {
    id: 2,
    patientName: "HENRY hhans",
    dateOfVisit: "2023-01-01",
    diagnosis: "Sprained neck",
    treatment: "some kind of treatment",
  },
  {
    id: 3,
    patientName: "HENRY hhans",
    dateOfVisit: "2023-01-01",
    diagnosis: "Sprained ankle",
    treatment: "some kind of medicine",
  },
];

const RecordDetailScreen = () => {
  let { id } = useParams<"id">();

  // for simulation purpose // change logic after api is implemented
  const record = records.find((record) => record.id.toString() === id);

  if (!record) {
    return <Typography variant="h6">Record not found</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Card elevation={3} sx={{ marginTop: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Record Details
          </Typography>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <PersonIcon color="action" />
            <Typography variant="subtitle1" marginLeft={1}>
              Patient Name: {record.patientName}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" alignItems="center" marginY={2}>
            <AccessTimeIcon color="action" />
            <Typography variant="subtitle1" marginLeft={1}>
              Date of Visit: {record.dateOfVisit}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" alignItems="center" marginY={2}>
            <LocalHospitalIcon color="action" />
            <Typography variant="subtitle1" marginLeft={1}>
              Diagnosis: {record.diagnosis}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" alignItems="center" marginY={2}>
            <HealingIcon color="action" />
            <Typography variant="subtitle1" marginLeft={1}>
              Treatment: {record.treatment}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecordDetailScreen;
