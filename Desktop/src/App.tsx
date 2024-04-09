import { Route, Routes } from "react-router-dom";
import "./App.css";

// Screen imports below
import AddRecordScreen from "./screens/AddRecord/addRecordScreen";
import ViewRecordsScreen from "./screens/ViewRecords/viewRecordsScreen";
import HomeScreen from "./screens/home";
import RecordDetailScreen from "./screens/ViewRecords/recordDetailScreen";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/addRecord" element={<AddRecordScreen />} />
      <Route path="/viewRecords" element={<ViewRecordsScreen />} />
      <Route path="/record-detail/:id" element={<RecordDetailScreen />} />
    </Routes>
  );
};

export default App;
