// FinalResultsPage.jsx
import React, { useEffect, useState } from "react";
import logo from "./logo.png";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { supabase } from "./supabase";

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
  const [showConfetti, setShowConfetti] = useState(true);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data: votesData, error } = await supabase.from("votes").select("*");
      if (error) {
        console.error("Error fetching votes:", error);
        return;
      }

      const taskWinners = computeTaskWinners(votesData);
      const overall = computeOverallWinner(taskWinners);
      setWinner(overall);
    };

    fetchVotes();
  }, []);

  const computeTaskWinners = (votesData) => {
    const taskVoteTallies = Array(tasks.length)
      .fill(null)
      .map(() => ({}));

    votesData.forEach((voteRecord) => {
      const voteObj = voteRecord.votes;
      Object.entries(voteObj).forEach(([taskIdx, participant]) => {
        if (!taskVoteTallies[taskIdx][participant]) {
          taskVoteTallies[taskIdx][participant] = 0;
        }
        taskVoteTallies[taskIdx][participant] += 1;
      });
    });

    return taskVoteTallies.map((tally) => {
      const entries = Object.entries(tally);
      if (entries.length === 0) return null;
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0][0];
    });
  };

  const computeOverallWinner = (taskWinners) => {
    const winCounts = {};

    taskWinners.forEach((winner) => {
      if (!winner) return;
      winCounts[winner] = (winCounts[winner] || 0) + 1;
    });

    const sorted = Object.entries(winCounts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "No winner";
  };

  return (
    <div className="bg-stripe min-h-screen flex flex-col items-center justify-center text-center px-6">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={20000} />}
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
      {winner && (
        <motion.p
          className="text-4xl md:text-5xl font-extrabold text-yellow-300 mt-6 drop-shadow-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {winner}
        </motion.p>
      )}
    </div>
  );
};

export default FinalResultsPage;
