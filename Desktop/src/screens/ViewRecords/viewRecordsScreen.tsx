import React, { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetRecordsService from "../../services/GetRecordsService";
import { useDispatch, useSelector } from "react-redux";
import { SET_PATIENT_ID } from "../../constants/constants";
import { RootState } from "../../redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
interface File {
  id: string;
  mimetype: string;
  name: string;
}

interface Institution {
  _id: string;
  institutionId: string;
}

interface Record {
  id: string;
  doctorFirstName: string;
  doctorLastName: string;
  patientId: string;
  doctorId: string;
  files: File[];
  institution: Institution;
  language: string;
  text: string;
  timestamp: string;
  title: string;
  typeOfRecord: string;
}

const ViewRecordsScreen = () => {
  // local state to store records | well might need to put it within redux as well,
  //bcs now we always fetching them again, when in fact no need,
  // since there could be back and forth navigation
  // although maybe store it within redux central state is not exactly necessary, need to figure out.
  // Caveat if store within redux is that it dumps this on client's ram. ~ this is how redux works.
  const [records, setRecords] = useState<Record[]>([]);
  // Access searchTerm(Paient id) from store
  const searchTerm = useSelector(
    (state: RootState) => state.searchReducer.patientId
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // hook to fetch records when searchTerm changes
  useEffect(() => {
    console.log("Helllaaaaa", searchTerm);
    if (searchTerm) {
      console.log("Helllaaaaa2");

      fetchRecords(searchTerm);
    }
  }, [searchTerm]);

  const fetchRecords = async (patientId: string) => {
    try {
      const response = await GetRecordsService.getRecords(patientId);
      if (response.success) {
        setRecords(response.data);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      dispatch({
        type: SET_PATIENT_ID,
        payload: localSearchTerm.trim(),
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Function to handle item click
  const handleItemClick = (recordId: string) => {
    navigate(`/record-detail/${recordId}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Records Dashboard
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 2, mb: 2 }}
        >
          <TextField
            label={searchTerm ? "Patient id: " + searchTerm : "Patient id"}
            variant="outlined"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ width: "auto", p: "6px 12px" }}
          >
            SEARCH
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date of Visit</TableCell>
                <TableCell align="right">Reason</TableCell>
                <TableCell align="right">Record</TableCell>
                <TableCell align="right">Language</TableCell>
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
                    {record.timestamp}
                  </TableCell>
                  <TableCell align="right">{record.title}</TableCell>
                  <TableCell align="right">{record.typeOfRecord}</TableCell>
                  <TableCell align="right">{record.language}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default ViewRecordsScreen;
