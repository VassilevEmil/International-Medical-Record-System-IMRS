import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Select,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

const AddRecordScreen = () => {
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [language, setLanguage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getColor = (props) => {
    if (props.isDragAccept) {
      return "#00e676";
    }
    if (props.isDragReject) {
      return "#ff1744";
    }
    if (props.isDragActive) {
      return "#2196f3";
    }
    return "#eeeeee";
  };

  const StyledDropzone = styled("div")(
    ({ isDragAccept, isDragReject, isDragActive }) => `
    border-width: 2px;
    border-radius: 2px;
    border-color: ${getColor({ isDragAccept, isDragReject, isDragActive })};
    border-style: dashed;
    background: white;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  `
  );

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
      "application/pdf": [],
      "text/plain": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  const files = uploadedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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
            <Paper
              variant="outlined"
              {...getRootProps()}
              sx={{ p: 2, mb: 2, textAlign: "center" }}
            >
              <input {...getInputProps()} />
              <StyledDropzone
                isDragActive={isDragActive}
                isDragAccept={isDragAccept}
                isDragReject={isDragReject}
              >
                <CloudUploadIcon sx={{ fontSize: 42 }} />
                <Typography variant="body2">
                  Drag 'n' drop some files here, or click to select files
                </Typography>
                <em>
                  (Only images, PDFs, DOCs, and TXT files will be accepted)
                </em>
              </StyledDropzone>
              <aside>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Accepted files
                </Typography>
                <ul>{files}</ul>
              </aside>
            </Paper>
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
