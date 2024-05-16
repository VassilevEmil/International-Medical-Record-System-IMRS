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
import FileUpload from "../../components/FileUpload";
import UploadRecordService from "../../services/UploadRecordService";
import StartTreatmentDate from '../../components/startTreatmentDate'
import UploadDrugService from "../../services/UploadDrugService";

const AddRecordScreen = () => {
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [language, setLanguage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPrescription, setIsPrescription] = useState(false);
  const [nameOfDrug, setNameOfDrug] = useState("");
  const [medicineComment, setMedicineComment] = useState("");
  const [durationNumber, setDurationNumber] = useState(0);
  const [startTreatmentDate, setStartTreatmentDate] = useState(new Date());

  const handleUpload = async () => {
    setUploadStatus("pending");
    setErrorMessage("");
    
    try {
      const formData = new FormData();

      const medicalRecord = {
        id: "2",
        patientId: "123",
        title: title,
        textInput: comment,
        typeOfRecord: isPrescription ? "PRESCRIPTION" : "Medical",
        institution: {
          id: "223",
          institutionId: "223",
          name: "Institution Name",
          country: "DENMARK",
          address: "Institution Address"
        },
        doctorId: "456",
        timeStamp: new Date().toISOString(),
        doctorFirstName: "Doctor",
        doctorLastName: "Smith",
        language: language,
      };

      if (isPrescription) {
        const drugRecord = {
          id: "1",
          patientId: "123",
          nameOfDrug: nameOfDrug,
          startTreatmentDate: new Date(startTreatmentDate).toISOString(),
          durationType: "DAYS",
          duration: durationNumber,
          isActive: true,
          timeStamp: new Date().toISOString(),
          comment: medicineComment,
          prescribedBy: "Doctor Smith"
        };
        formData.append("drugRecord", JSON.stringify(drugRecord));
      }
      
      formData.append("medicalRecord", JSON.stringify(medicalRecord));
      uploadedFiles.forEach((file) => {
        formData.append("fileInput", file);
      });

      const prescriptionResponse = await UploadDrugService.uploadPrescription(formData);
      if (!prescriptionResponse.success) {
        setUploadStatus("failed");
        setErrorMessage(prescriptionResponse.message);
        return;
      }

      const response = await UploadRecordService.uploadRecord(formData);
      if (response.success) {
        setUploadStatus("succeeded");
      } else {
        setUploadStatus("failed");
        setErrorMessage(response.message);
      }
    } catch (error) {
      setUploadStatus("failed");
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpload();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom component="div" sx={{ mt: 4, mb: 4 }}>
        Add Record
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              fullWidth
              value={recordType}
              onChange={(e) => {
                setRecordType(e.target.value);
                setIsPrescription(e.target.value === "Prescription");
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>Type of Record</MenuItem>
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
              <MenuItem value="" disabled>Language</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
              <MenuItem value="German">German</MenuItem>
            </Select>
          </Grid>
          {isPrescription && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name of Drug"
                  value={nameOfDrug}
                  onChange={(e) => setNameOfDrug(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comment on Medicine"
                  value={medicineComment}
                  onChange={(e) => setMedicineComment(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Days"
                  value={durationNumber}
                  onChange={(e) => setDurationNumber(parseInt(e.target.value))}
                />
              </Grid>
              <MenuItem value="" disabled>Duration Type</MenuItem>
              <MenuItem value="DAYS">Days</MenuItem>
              <MenuItem value="WEEKS">Weeks</MenuItem>
              <MenuItem value="MONTHS">Months</MenuItem>
              <MenuItem value="YEARS">Years</MenuItem>
              <MenuItem value="INDEFINETELY">Indefinitely</MenuItem>
              <StartTreatmentDate
                startTreatmentDate={startTreatmentDate}
                setStartTreatmentDate={setStartTreatmentDate}
              />
            </>
          )}
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
