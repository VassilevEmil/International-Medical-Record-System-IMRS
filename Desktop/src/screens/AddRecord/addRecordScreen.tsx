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

const AddRecordScreen = () => {
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [language, setLanguage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      <Box component="form" noValidate autoComplete="off">
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
            <Button variant="contained" fullWidth>
              Add Record
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddRecordScreen;
