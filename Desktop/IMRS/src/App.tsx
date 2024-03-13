import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>("");
  const [text, setText] = useState<string>("");

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const textChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleFileSubmission = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();

      if (resData.IpfsHash && resData.Timestamp) {
        setIpfsHash(resData.IpfsHash);
        setTimestamp(resData.Timestamp);
      } else {
        console.error("Invalid response format:", resData);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleTextSubmission = async () => {
    try {
      const metadata = JSON.stringify({
        name: "Plain Text File",
      });

      const options = JSON.stringify({
        cidVersion: 0,
      });

      const formData = new FormData();
      formData.append("file", new Blob([text], { type: "text/plain" }), "file.txt");
      formData.append("pinataMetadata", metadata);
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const resData = await res.json();

      if (resData.IpfsHash && resData.Timestamp) {
        setIpfsHash(resData.IpfsHash);
        setTimestamp(resData.Timestamp);
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

      <label className="form-label">Enter Plain Text:</label>
      <textarea value={text} onChange={textChangeHandler}></textarea>
      <button onClick={handleTextSubmission}>Submit Text</button>

      {ipfsHash && timestamp && (
        <div>
          <p>IpfsHash: {ipfsHash}</p>
          <p>Timestamp: {timestamp}</p>
        </div>
      )}
    </>
  );
}

export default App;
