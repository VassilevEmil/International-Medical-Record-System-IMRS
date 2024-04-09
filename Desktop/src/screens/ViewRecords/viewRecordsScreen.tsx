import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ViewRecordsScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([
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
  ]);

  const navigate = useNavigate();

  const handleItemClick = (recordId: any) => {
    navigate(`/record-detail/${recordId}`);
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Medical Records Dashboard
      </Typography>
      <TextField
        fullWidth
        label="Search patient"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ marginBottom: 2 }}
      >
        Search
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell align="right">Date of Visit</TableCell>
              <TableCell align="right">Diagnosis</TableCell>
              <TableCell align="right">Treatment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record.id}
                hover
                onClick={() => handleItemClick(record.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {record.patientName}
                </TableCell>
                <TableCell align="right">{record.dateOfVisit}</TableCell>
                <TableCell align="right">{record.diagnosis}</TableCell>
                <TableCell align="right">{record.treatment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ViewRecordsScreen;
