import React, { useEffect, useState } from "react";
import logo from "./logo.png";
import { supabase } from "./supabase";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

const FinalResultsPage = () => {
  const { width, height } = useWindowSize();
  const [overallWinner, setOverallWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const calculateWinner = async () => {
      const { data, error } = await supabase.from("votes").select();
      if (error) {
        console.error("Error fetching votes:", error);
        return;
      }

      const taskWins = {};
      const totalVotes = {};

      // For each task, find who got the most votes
      for (let i = 0; i < tasks.length; i++) {
        const taskVotes = {};
        data.forEach(({ votes }) => {
          const vote = votes[i];
          if (vote) {
            taskVotes[vote] = (taskVotes[vote] || 0) + 1;
            totalVotes[vote] = (totalVotes[vote] || 0) + 1;
          }
        });

        const sorted = Object.entries(taskVotes).sort((a, b) => b[1] - a[1]);
        const top = sorted[0];
        if (top) {
          const [winner] = top;
          taskWins[winner] = (taskWins[winner] || 0) + 1;
        }
      }

      const maxWins = Math.max(...Object.values(taskWins));
      const topParticipants = Object.entries(taskWins).filter(([_, wins]) => wins === maxWins);

      if (topParticipants.length === 1) {
        setOverallWinner(topParticipants[0][0]);
      } else {
        // Tie-breaker based on total votes
        const tieSorted = topParticipants
          .map(([name]) => [name, totalVotes[name] || 0])
          .sort((a, b) => b[1] - a[1]);

        setOverallWinner(tieSorted[0][0] || "No winner");
      }
    };

    calculateWinner();

    const timer = setTimeout(() => setShowConfetti(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-stripe min-h-screen flex flex-col items-center justify-center text-center px-6">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={7000} />}
      <motion.img
        src={logo}
        alt="Logo"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-72 md:w-96 mb-10"
      />
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        OVERALL WINNER
      </motion.h1>
      <motion.p
        className="text-4xl md:text-5xl font-extrabold text-yellow-300 mt-6 drop-shadow-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {overallWinner || "Calculating..."}
      </motion.p>
    </div>
  );
};

export default FinalResultsPage;
