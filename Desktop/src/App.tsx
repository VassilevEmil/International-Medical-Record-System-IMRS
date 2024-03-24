import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";

// Screen imports below
import AddRecordScreen from "./screens/AddRecord/addRecordScreen";
import HomeScreen from "./screens/home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/addRecord" element={<AddRecordScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
