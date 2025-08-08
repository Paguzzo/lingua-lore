
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";

const App = () => {
  console.log("App está sendo inicializada");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="*" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
