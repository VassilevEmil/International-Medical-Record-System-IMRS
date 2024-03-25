import { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Select,
} from "@mui/material";
import FileUpload from "../../components/FileUpload"; // Adjust the path as necessary
import UploadRecordService from "../../services/UploadRecordService"; // Adjust the path as necessary

const AddRecordScreen = () => {
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [language, setLanguage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    setUploadStatus("pending");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("institutionId", "#4r4523ed");
      formData.append("patientId", "233");
      formData.append("title", title);
      formData.append("textInput", comment);
      uploadedFiles.forEach((file) => {
        formData.append("fileInput", file);
      });
      formData.append("typeOfRecord", recordType);
      formData.append("doctorId", "2d2423s");
      formData.append("doctorFirstName", "Simas");
      formData.append("doctorLastName", "Simukas");
      formData.append("language", language);

      const response = await UploadRecordService.uploadRecord(formData);

      if (response.success) {
        console.log(response.message, response.data);
        setUploadStatus("succeeded");
      } else {
        console.error(response.message);
        setUploadStatus("failed");
        setErrorMessage(response.message);
      }
    } catch (error) {
      setUploadStatus("failed");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleUpload();
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        sx={{ mt: 4, mb: 4 }}
      >
        Add Record
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleFormSubmit}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              fullWidth
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                Type of Record
              </MenuItem>
              <MenuItem value="Medical">Medical</MenuItem>
              <MenuItem value="Invoice">Invoice</MenuItem>
              <MenuItem value="Prescription">Prescription</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comment"
              multiline
              minRows={3}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FileUpload
              setUploadedFiles={setUploadedFiles}
              uploadedFiles={uploadedFiles}
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                Language
              </MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
              <MenuItem value="German">German</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth type="submit">
              Add Record
            </Button>
          </Grid>
        </Grid>
      </Box>
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {errorMessage}
        </Typography>
      )}
    </Container>
  );
};

export default AddRecordScreen;
