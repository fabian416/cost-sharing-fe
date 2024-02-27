import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import  LandingPage  from './views/LandingPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;