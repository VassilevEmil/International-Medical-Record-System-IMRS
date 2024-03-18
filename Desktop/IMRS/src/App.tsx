import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    patientId: "",
    diagnose: "",
    treatment: "",
    issuedBy: "",
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const textChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleFileSubmission = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const res = await fetch("https://localhost:3000/medicalRecords/medicalRecord", {
        method: "POST",
        body: formData,
      });
      
      const resData = await res.json();

      if (resData.ipfsHash && resData.timestamp) {
        setIpfsHash(resData.ipfsHash);
        setTimestamp(resData.timestamp);
      } else {
        console.error("Invalid response format:", resData);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleTextSubmission = async () => {
    try {
      const res = await fetch("https://localhost:3000/medicalRecords/medicalRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (resData.textCID && resData.imageCID) {
        setIpfsHash(resData.textCID);
        setTimestamp("");
      } else {
        console.error("Invalid response format:", resData);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
      <label className="form-label">Choose File</label>
      <input type="file" onChange={changeHandler} />
      <button onClick={handleFileSubmission}>Submit File</button>

      <hr />

      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => textChangeHandler(e, "name")}
        />
      </div>
      <div>
        <label>Patient ID:</label>
        <input
          type="text"
          value={formData.patientId}
          onChange={(e) => textChangeHandler(e, "patientId")}
        />
      </div>
      <div>
        <label>Diagnose:</label>
        <input
          type="text"
          value={formData.diagnose}
          onChange={(e) => textChangeHandler(e, "diagnose")}
        />
      </div>
      <div>
        <label>Treatment:</label>
        <input
          type="text"
          value={formData.treatment}
          onChange={(e) => textChangeHandler(e, "treatment")}
        />
      </div>
      <div>
        <label>Issued by:</label>
        <input
          type="text"
          value={formData.issuedBy}
          onChange={(e) => textChangeHandler(e, "issuedBy")}
        />
      </div>
      <button onClick={handleTextSubmission}>Submit Text</button>

      {ipfsHash && (
        <div>
          <p>
            IPFS Hash: <a href={`ipfs://${ipfsHash}`}>{ipfsHash}</a>
          </p>
          {timestamp && <p>Timestamp: {timestamp}</p>}
        </div>
      )}
    </>
  );
}

export default App;
