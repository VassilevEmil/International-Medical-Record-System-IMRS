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
  ListItemIcon,
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

const RecordDetailScreen = () => {
  let { id } = useParams<"id">();
  const [record, setRecord] = useState<Record>(); // not sure, need to think when fresh, might not need state
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleClickFile = (file: File) => {
    navigate("/file-view", {
      state: { file: file, recordId: record?.id }, // we pass current record id, to which the file is connected to
    });
  };

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      if (id) {
        try {
          const response = await GetRecordsService.fetchRecord(id);
          if (response.success && response.data) {
            setIsLoading(false);
            setRecord(response.data);
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
            justifyContent: "center",
            alignItems: "center",
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
            textAlign: "center",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
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
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ marginTop: 2, minWidth: 600 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Record Details
            </Typography>
            <Box display="flex" alignItems="center" marginBottom={2}>
              <PersonIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Patient Name: {record?.doctorFirstName}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" marginY={2}>
              <AccessTimeIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Date of Visit: {record?.doctorId}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" marginY={2}>
              <LocalHospitalIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Diagnosis: {record?.doctorLastName}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" marginY={2}>
              <HealingIcon color="action" />
              <Typography variant="subtitle1" marginLeft={1}>
                Treatment: {record?.title}
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
                      button
                      onClick={() => handleClickFile(file)}
                    >
                      <ListItemIcon></ListItemIcon>
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
