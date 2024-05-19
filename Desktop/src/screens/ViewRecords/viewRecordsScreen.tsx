import React, { useEffect, useState } from "react";
import {
  Container,
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
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetRecordsService from "../../services/GetRecordsService";
import { useAppContext } from "../../context/AppContext";
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

const ViewRecordsScreen: React.FC = () => {
  const { selectedInstitution, patientData } = useAppContext();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordLimit, setRecordLimit] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => {
    return prefersDarkMode ? darkTheme : lightTheme;
  }, [prefersDarkMode]);

  const navigate = useNavigate();

  useEffect(() => {
    if (patientData) {
      fetchRecords(patientData.patientId, page, recordLimit);
    }
  }, [patientData, page, recordLimit]);

  const fetchRecords = async (
    patientId: string,
    page: number,
    recordLimit: number
  ) => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state before fetching records
      if (selectedInstitution) {
        const response = await GetRecordsService.getRecords(
          patientId,
          page,
          recordLimit,
          selectedInstitution.apiKey,
          selectedInstitution.institutionId
        );
        if (response.success && response.data) {
          setRecords(response.data.medicalRecords);
          setTotalRecords(response.data.total);
        } else {
          setError(response.message);
        }
      } else {
        setError("No institution selected.");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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
