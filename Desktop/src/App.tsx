import { Route, Routes } from "react-router-dom";
import "./css/App.css";

// Screen imports below
import AddRecordScreen from "./screens/AddRecord/addRecordScreen";
import HomeScreen from "./screens/home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/addRecord" element={<AddRecordScreen />} />
    </Routes>
  );
};

export default App;
