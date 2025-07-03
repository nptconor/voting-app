// FinalResultsPage.jsx
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
  const [overallWinner, setOverallWinner] = useState("");
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

      data.forEach(({ votes }) => {
        votes.forEach((vote, taskIndex) => {
          if (!vote) return;
          totalVotes[vote] = (totalVotes[vote] || 0) + 1;
        });
      });

      for (let i = 0; i < tasks.length; i++) {
        const countMap = {};
        data.forEach(({ votes }) => {
          const vote = votes[i];
          if (vote) countMap[vote] = (countMap[vote] || 0) + 1;
        });

        const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
        const topVoteGetter = sorted[0]?.[0];
        if (topVoteGetter) {
          taskWins[topVoteGetter] = (taskWins[topVoteGetter] || 0) + 1;
        }
      }

      const maxWins = Math.max(...Object.values(taskWins));
      const tied = Object.entries(taskWins).filter(([, wins]) => wins === maxWins);

      if (tied.length === 1) {
        setOverallWinner(tied[0][0]);
      } else {
        // Break tie by total votes across all tasks
        const sortedTiebreak = tied
          .map(([name]) => [name, totalVotes[name] || 0])
          .sort((a, b) => b[1] - a[1]);
        setOverallWinner(sortedTiebreak[0][0]);
      }
    };

    calculateWinner();

    const timer = setTimeout(() => setShowConfetti(false), 100000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-stripe min-h-screen flex flex-col items-center justify-center text-center px-6">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={5000} />}
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
      {overallWinner && (
        <motion.p
          className="text-4xl md:text-5xl font-extrabold text-yellow-300 mt-6 drop-shadow-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {overallWinner}
        </motion.p>
      )}
    </div>
  );
};

export default FinalResultsPage;
