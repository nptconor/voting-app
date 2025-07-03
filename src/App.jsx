// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VotingPage from "./VotingPage";
import ResultsPage from "./ResultsPage";
import FinalResultsPage from "./FinalResultsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/final" element={<FinalResultsPage winner={overallWinner} />} />
      </Routes>
    </Router>
  );
}
