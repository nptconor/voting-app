// FinalResultsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function FinalResultsPage() {
  const [overallWinner, setOverallWinner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVotes() {
      const { data: votesData, error } = await supabase.from("votes").select("*");
      if (error) {
        console.error("Error fetching votes:", error);
        return;
      }

      const scoreMap = {};

      votesData.forEach((voteEntry) => {
        const voteObj = voteEntry.votes;
        for (const taskIndex in voteObj) {
          const participant = voteObj[taskIndex];
          if (!scoreMap[participant]) {
            scoreMap[participant] = 0;
          }
          scoreMap[participant] += 1;
        }
      });

      let topScorer = "";
      let topScore = -1;

      for (const [participant, score] of Object.entries(scoreMap)) {
        if (score > topScore) {
          topScore = score;
          topScorer = participant;
        }
      }

      setOverallWinner(topScorer);
      setLoading(false);
    }

    fetchVotes();
  }, []);

  return (
    <div className="relative p-8 max-w-3xl mx-auto min-h-screen font-special text-black text-center">
      <div className="bg-stripe fixed inset-0 -z-10"></div>
      <div className="bg-white p-10 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-stroke text-white">
          OVERALL WINNER
        </h1>
        {loading ? (
          <p className="text-black text-xl">Loading...</p>
        ) : (
          <p className="text-5xl font-extrabold uppercase text-yellow-600">
            🎉 {overallWinner} 🎉
          </p>
        )}
      </div>
    </div>
  );
}

export default FinalResultsPage;
