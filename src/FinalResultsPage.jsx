// FinalResultsPage.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

export default function FinalResultsPage() {
  const [overallWinners, setOverallWinners] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("overallWinners");
    if (stored) {
      setOverallWinners(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="relative p-4 max-w-3xl mx-auto min-h-screen font-special text-black">
      <div className="bg-stripe fixed inset-0 -z-10"></div>
      <h1 className="text-4xl font-bold text-center mb-8 text-white text-stroke">OVERALL WINNER</h1>

      {overallWinners.length > 0 ? (
        <div className="text-center mt-12">
          {overallWinners.map((name) => (
            <div
              key={name}
              className="text-4xl font-bold text-yellow-400 bg-white p-6 rounded-xl shadow-xl uppercase"
            >
              🏆 {name}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-center">No overall winner found.</p>
      )}
    </div>
  );
}
