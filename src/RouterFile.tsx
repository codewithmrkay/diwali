// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page1 from './Page1';
import App from './App'
const RouteFile: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/display" element={<App/>} />
      </Routes>
    </Router>
  );
};

export default RouteFile;
