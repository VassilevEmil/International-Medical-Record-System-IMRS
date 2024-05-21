import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GetFileService from "../../services/GetFileService";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppContext } from "../../context/AppContext";

interface File {
  id: string;
  mimetype: string;
  name: string;
}

interface FileContent {
  url: string;
  mimeType: string;
}

const FileScreen = () => {
  const { selectedInstitution } = useAppContext();
  const location = useLocation();
  const [fileContent, setFileContent] = useState<FileContent>({
    url: "",
    mimeType: "",
  });
  const fileData = location.state.file as File;
  const recordId = location.state.recordId as string;
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  if (!fileData) {
    return <div>No file data available.</div>;
  }

  useEffect(() => {
    fetchFile(recordId, fileData.id);
  }, [fileData]);

  const fetchFile = async (medicalRecordId: string, fileId: string) => {
    setIsLoading(true);
    try {
      if (selectedInstitution) {
        const response = await GetFileService.getFile(
          medicalRecordId,
          fileId,
          selectedInstitution.apiKey,
          selectedInstitution.institutionId
        );
        if (response.success && response.data) {
          const mimeType = response.mimeType
            ? response.mimeType.split(";")[0]
            : undefined;
          setFileContent({
            url: response.data,
            mimeType: mimeType ?? "",
          });
        }
      } else {
        console.log("Server responded with an error status");
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderFile = () => {
    if (isLoading) {
      return <CircularProgress />;
    }
    if (fileContent.mimeType.startsWith("image/")) {
      return (
        <img
          src={fileContent.url}
          alt="image"
          style={{ maxWidth: "100%", maxHeight: "600px" }}
        />
      );
    } else if (fileContent.mimeType === "application/pdf") {
      return (
        <iframe
          src={fileContent.url}
          style={{ width: "1200px", height: "800px" }}
          title="Document"
        />
      );
    } else {
      return <div>Unsupported file type.</div>;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{ position: "fixed", top: "16px", left: "16px", zIndex: 1000 }}
      >
        Go Back
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {renderFile()}
      </div>
    </div>
  );
};

export default FileScreen;
