import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

// Screen imports
import AddRecordScreen from "./screens/AddRecord/addRecordScreen";
import ViewRecordsScreen from "./screens/ViewRecords/viewRecordsScreen";
import HomeScreen from "./screens/home";
import RecordDetailScreen from "./screens/ViewRecords/recordDetailScreen";
import FileScreen from "./screens/ViewRecords/FileScreen";
import Header from "./components/Header";
import { AppProvider } from "./context/AppContext";

const App = () => {
  return (
    <AppProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/addRecord" element={<AddRecordScreen />} />
        <Route path="/viewRecords" element={<ViewRecordsScreen />} />
        <Route path="/record-detail/:id" element={<RecordDetailScreen />} />
        <Route path="/file-view" element={<FileScreen />} />
      </Routes>
    </AppProvider>
  );
};

export default App;
