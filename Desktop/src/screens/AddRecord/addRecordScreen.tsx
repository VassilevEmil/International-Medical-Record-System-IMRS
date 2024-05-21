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
  Snackbar,
  Alert,
} from "@mui/material";
import FileUpload from "../../components/FileUpload";
import UploadRecordService from "../../services/UploadRecordService";
import StartTreatmentDate from "../../components/startTreatmentDate";
import UploadDrugService from "../../services/UploadDrugService";
import {
  DurationType,
  Language,
  TypeOfRecord,
  formatEnumValue,
} from "../../../enums";
import { useAppContext } from "../../context/AppContext";

const AddRecordScreen = () => {
  const { selectedInstitution, patientData } = useAppContext();
  const [recordType, setRecordType] = useState("");
  const [languageType, setLanguageType] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameOfDrug, setNameOfDrug] = useState("");
  const [durationNumber, setDurationNumber] = useState(0);
  const [startTreatmentDate, setStartTreatmentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState("");
  const [durationType, setDurationType] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleUpload = async () => {
    setUploadStatus("pending");
    setErrorMessage("");

    try {
      const formData = new FormData();

      if (selectedInstitution && patientData) {
        formData.append("institutionId", selectedInstitution.institutionId);
        formData.append("patientId", patientData.patientId);
      }
      formData.append("title", title);
      formData.append("textInput", comment);
      formData.append("typeOfRecord", recordType);

      if (selectedInstitution) {
        if (selectedInstitution.doctorId) {
          formData.append("doctorId", selectedInstitution.doctorId);
        }
        if (selectedInstitution.doctorFirstName) {
          formData.append(
            "doctorFirstName",
            selectedInstitution.doctorFirstName
          );
        }
        if (selectedInstitution.doctorLastName) {
          formData.append("doctorLastName", selectedInstitution.doctorLastName);
        }
      }

      formData.append("language", languageType);

      if (recordType === TypeOfRecord.Prescription) {
        formData.append("nameOfDrug", nameOfDrug);
        formData.append(
          "startTreatmentDate",
          new Date(startTreatmentDate).toISOString()
        );
        formData.append("durationType", durationType);
        formData.append("duration", durationNumber.toString());
        formData.append("comment", comment);
      }
      uploadedFiles.forEach((file) => {
        formData.append("fileInput", file);
      });

      if (recordType === TypeOfRecord.Prescription && selectedInstitution) {
        const addRecordResponse = await UploadDrugService.uploadDrugRecord(
          formData,
          selectedInstitution?.apiKey,
          selectedInstitution?.institutionId
        );

        if (!addRecordResponse.success) {
          setUploadStatus("failed");
          setErrorMessage(addRecordResponse.message);
          setSnackbarMessage(addRecordResponse.message);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          return;
        }

        setUploadStatus("succeeded");
        setSnackbarMessage("Record added successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        return;
      }

      if (selectedInstitution) {
        const response = await UploadRecordService.uploadRecord(
          formData,
          selectedInstitution.apiKey,
          selectedInstitution.institutionId
        );

        if (response.success) {
          setUploadStatus("succeeded");
          setSnackbarMessage("Record added successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setUploadStatus("failed");
          setErrorMessage(response.message);
          setSnackbarMessage(response.message);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      setUploadStatus("failed");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setSnackbarMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleChangeRecordType = (event: any) => {
    const newRecordType = event.target.value;
    setRecordType(newRecordType);
    setSelectedRecord(newRecordType);
  };

  const handleChangeLanguage = (event: any) => {
    const newLanguage = event.target.value;
    setLanguageType(newLanguage);
  };

  const handleChangeDurationType = (event: any) => {
    const newDurationType = event.target.value;
    setDurationType(newDurationType);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpload();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "calc(100vh - 64px)", mt: 4, mb: 4 }}
    >
      <Typography
        variant="h4"
        gutterBottom
        color={"black"}
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
              value={selectedRecord}
              onChange={handleChangeRecordType}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">
                <em>Record Type</em>
              </MenuItem>
              {Object.values(TypeOfRecord).map((type) => (
                <MenuItem key={type} value={type}>
                  {formatEnumValue(type)}
                </MenuItem>
              ))}
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
              value={languageType}
              onChange={handleChangeLanguage}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">
                <em>Language</em>
              </MenuItem>
              {Object.values(Language).map((type) => (
                <MenuItem key={type} value={type}>
                  {formatEnumValue(type)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {recordType == TypeOfRecord.Prescription && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name of Drug"
                  value={nameOfDrug}
                  onChange={(e) => setNameOfDrug(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                container
                spacing={2}
                marginBottom={-2}
                marginTop={3}
                color={"black"}
              >
                <Grid marginLeft={1}>
                  <MenuItem value="" disabled>
                    <em>Duration Type:</em>
                  </MenuItem>
                </Grid>
                {Object.values(DurationType).map((type) => (
                  <Grid key={type}>
                    <MenuItem
                      onClick={() =>
                        handleChangeDurationType({ target: { value: type } })
                      }
                      value={type}
                      selected={durationType === type}
                    >
                      {formatEnumValue(type)}
                    </MenuItem>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={durationNumber}
                  onChange={(e) => setDurationNumber(parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <StartTreatmentDate
                  startTreatmentDate={startTreatmentDate}
                  setStartTreatmentDate={setStartTreatmentDate}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Button variant="contained" fullWidth type="submit">
              Add Record
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddRecordScreen;
