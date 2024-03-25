import { useCallback, FC } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

interface FileUploadProps {
  setUploadedFiles: (files: File[]) => void;
  uploadedFiles: File[];
}

const StyledDropzone = styled("div")<{
  isDragAccept: boolean;
  isDragReject: boolean;
  isDragActive: boolean;
}>(
  ({ isDragAccept, isDragReject, isDragActive }) => `
    border-width: 2px;
    border-radius: 2px;
    border-color: ${
      isDragAccept
        ? "#00e676"
        : isDragReject
        ? "#ff1744"
        : isDragActive
        ? "#2196f3"
        : "#eeeeee"
    };
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

const FileUpload: FC<FileUploadProps> = ({
  setUploadedFiles,
  uploadedFiles,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setUploadedFiles]
  );

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".svg"],
      "application/pdf": [],
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      // [],
    },
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone(dropzoneOptions);

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, mb: 2, textAlign: "center", cursor: "pointer" }}
      {...getRootProps()}
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
        <Typography variant="caption">
          (Only images (svg, jpeg, png) and PDF files will be accepted)
        </Typography>
      </StyledDropzone>
      <List>
        {uploadedFiles.map((file, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={file.name}
              secondary={`${file.size} bytes`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FileUpload;
