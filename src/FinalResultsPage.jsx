
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import logo from "./logo.png";

function FinalResultsPage() {
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    async function calculateOverallWinner() {
      const { data, error } = await supabase.from("votes").select("votes");
      if (error) {
        console.error("Error fetching votes:", error);
        return;
      }

      const scores = {};
      data.forEach(({ votes }) => {
        Object.values(votes).forEach((name) => {
          scores[name] = (scores[name] || 0) + 1;
        });
      });

      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      if (sorted.length) {
        setWinner(sorted[0][0]);
      }
    }

    calculateOverallWinner();
  }, []);

  return (
    <div className="min-h-screen bg-stripe flex flex-col justify-center items-center text-white p-6 text-center">
      <img src={logo} alt="Logo" className="w-60 mb-10" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">OVERALL WINNER</h1>
      <div className="text-3xl md:text-4xl bg-white text-black px-10 py-4 rounded-lg border-4 border-black font-bold">
        {winner || "Loading..."}
      </div>
    </div>
  );
}

export default FinalResultsPage;
