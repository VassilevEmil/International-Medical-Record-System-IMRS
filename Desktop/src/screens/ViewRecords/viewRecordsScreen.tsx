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
import GetRecordsService from "../../services/GetRecordsService";
import GetFileService from "../../services/GetFileService";

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

  interface FileContent {
    url: string | undefined;
    mimeType: string | undefined; // hould match the type expected in GetFileResponse
  }

  //GetFile LOCAL state hook
  const [fileContent, setFileContent] = useState<FileContent>({
    url: "",
    mimeType: undefined,
  });

  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const response = await GetRecordsService.getRecords();
      if (response.success) {
        console.log(response.data);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const fetchFile = async (medicalRecordId: string, fileId: string) => {
    try {
      const response = await GetFileService.getFile(medicalRecordId, fileId);
      if (response.success && response.data) {
        const mimeType = response.mimeType
          ? response.mimeType.split(";")[0]
          : undefined;
        setFileContent({
          url: response.data,
          mimeType: mimeType,
        });
      } else {
        console.log("Server responded with an error status");
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  React.useEffect(() => {
    // consts hardcoded for black box testing purposes, will be changed later on
    const medicalRecordId = "0eli3znphwo8";
    const fileId = "8z61djvtm37";
    fetchFile(medicalRecordId, fileId);
    return () => {
      if (fileContent.url) {
        URL.revokeObjectURL(fileContent.url);
      }
    };
  }, []);

  function renderContent({ url, mimeType }: FileContent) {
    if (!url) {
      return <div>Loading...</div>;
    }

    if (mimeType && mimeType.startsWith("image/")) {
      return <img src={url} alt="Fetched content" />;
    } else if (mimeType === "application/pdf") {
      return (
        <iframe
          src={url}
          width="100%"
          height="600px"
          title="PDF content"
          onError={() => console.error("Error loading PDF")}
        ></iframe>
      );
    } else {
      return <div>Unsupported content type: {mimeType}</div>;
    }
  }

  const handleItemClick = (recordId: any) => {
    navigate(`/record-detail/${recordId}`);
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
  };

  return (
    <Container maxWidth="lg">
      <div>
        {fileContent.url ? renderContent(fileContent) : <div>Loading...</div>}
      </div>
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
