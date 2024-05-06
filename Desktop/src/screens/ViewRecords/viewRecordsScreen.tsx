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
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetRecordsService from "../../services/GetRecordsService";
import { useDispatch, useSelector } from "react-redux";
import { SET_PATIENT_ID } from "../../constants/constants";
import { RootState } from "../../redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MedicalRecord } from "../../models/medicalRecord";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
});

const ViewRecordsScreen = () => {
  // local state to store records | well might need to put it within redux as well,
  //bcs now we always fetching them again, when in fact no need,
  // since there could be back and forth navigation
  // although maybe store it within redux central state is not exactly necessary, need to figure out.
  // Caveat if store within redux is that it dumps this on client's ram. ~ this is how redux works.
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordLimit, setRecordLimit] = useState(5);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => {
    return prefersDarkMode ? darkTheme : lightTheme;
  }, [prefersDarkMode]);

  // Access searchTerm(Paient id) from store
  const searchTerm = useSelector(
    (state: RootState) => state.searchReducer.patientId
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [localSearchTerm, setLocalSearchTerm] = useState("");

  useEffect(() => {
    fetchRecords(searchTerm, page, recordLimit);
  }, [searchTerm, page, recordLimit]);

  const fetchRecords = async (
    patientId: string,
    page: number,
    recordLimit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await GetRecordsService.getRecords(
        patientId,
        page,
        recordLimit
      );
      if (response.success && response.data) {
        setIsLoading(false);
        setRecords(response.data.medicalRecords);
        setTotalRecords(response.data.total);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleSearch = () => {
    setPage(1);
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
    sessionStorage.setItem("currentPage", page.toString());
    navigate(`/record-detail/${recordId}`);
  };

  const handlePreviousClick = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextClick = () => {
    if (page < Math.ceil(totalRecords / recordLimit)) setPage(page + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setRecordLimit(value);
    setPage(1);
  };

  return (
    <ThemeProvider theme={theme}>
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
            label={searchTerm ? `Patient id: ${searchTerm}` : "Search patient"}
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
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Record Id</TableCell>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Time</TableCell>
                    <TableCell align="left">Type</TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="left">Doctor</TableCell>
                    <TableCell align="left">Language</TableCell>
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
                        {record.id}
                      </TableCell>
                      <TableCell align="left">
                        {new Date(record.timeStamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="left">
                        {new Date(record.timeStamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell align="left">{record.typeOfRecord}</TableCell>
                      <TableCell align="left">{record.title}</TableCell>
                      <TableCell align="left">
                        {record.doctorFirstName + " " + record.doctorLastName}
                      </TableCell>

                      <TableCell align="left">{record.language}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "20px 0",
              }}
            >
              <button
                onClick={handlePreviousClick}
                disabled={page === 1}
                style={{
                  padding: "6px 12px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                {"<"}
              </button>
              <div>
                Rows per page:
                <select
                  value={recordLimit}
                  onChange={handleChangeRowsPerPage}
                  style={{ margin: "0 10px" }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                {`${(page - 1) * recordLimit + 1}-${Math.min(
                  page * recordLimit,
                  totalRecords
                )} of ${totalRecords}`}
              </div>
              <button
                onClick={handleNextClick}
                disabled={page >= Math.ceil(totalRecords / recordLimit)}
                style={{
                  padding: "6px 12px",
                  cursor:
                    page >= Math.ceil(totalRecords / recordLimit)
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {">"}
              </button>
            </div>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ViewRecordsScreen;
