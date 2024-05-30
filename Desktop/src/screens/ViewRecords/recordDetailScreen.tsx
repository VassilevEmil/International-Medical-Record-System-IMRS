import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import PersonIcon from "@mui/icons-material/Person";
import GetRecordsService from "../../services/GetRecordsService";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAppContext } from "../../context/AppContext";

const darkTheme = createTheme({
  palette: {
    mode: "light",
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
  timeStamp: Date;
  title: string;
  typeOfRecord: string;
}

const RecordDetailScreen = () => {
  let { id } = useParams<"id">();
  const [record, setRecord] = useState<Record>();
  const [isLoading, setIsLoading] = useState(true);
  const { selectedInstitution, patientData } = useAppContext();

  const navigate = useNavigate();

  const handleClickFile = (file: File) => {
    navigate("/file-view", {
      state: { file: file, recordId: record?.id },
    });
  };

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      if (id) {
        try {
          if (selectedInstitution) {
            const response = await GetRecordsService.fetchRecord(
              id,
              selectedInstitution.apiKey,
              selectedInstitution.institutionId
            );
            if (response.success && response.data) {
              setIsLoading(false);
              setRecord(response.data);
            }
          } else {
            console.error("Failed to fetch record:", response.message);
          }
        } catch (error) {
          console.error("Error fetching record:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRecord();
  }, [id]);

  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Container>
      </ThemeProvider>
    );
  }

  if (!record && !isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            height: "100vh",
          }}
        >
          <Typography variant="h6">Record not found</Typography>
          <Button
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card elevation={3} sx={{ minWidth: 600 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Record Details
            </Typography>
            <Box display="flex" marginBottom={2} alignItems="center">
              <PersonIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Patient Name:{" "}
                {patientData?.patientFirstName +
                  " " +
                  patientData?.patientLastName}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" marginY={2} alignItems="center">
              <AccessTimeIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Date of Visit:{" "}
                {new Date(record?.timeStamp).toLocaleDateString()}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" marginY={2} alignItems="center">
              <LocalHospitalIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Diagnosis: {record?.title}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" marginY={2} alignItems="flex-start">
              <HealingIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1} align="left">
                Treatment: {record?.text}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" flexDirection="column" marginY={2}>
              <Typography variant="subtitle1" gutterBottom>
                Attached Files:
              </Typography>
              {record?.files && record.files.length > 0 ? (
                <List>
                  {record.files.map((file, index) => (
                    <ListItem
                      key={index}
                      onClick={() => handleClickFile(file)}
                      sx={{ display: "flex" }}
                    >
                      <ListItemText
                        primary={file.name}
                        secondary={`Type: ${file.mimetype}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No files attached.</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
        <Box marginTop={4}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RecordDetailScreen;
