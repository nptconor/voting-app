// FinalResultsPage.jsx
import React, { useEffect, useState } from "react";
import logo from "./logo.png";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { supabase } from "./supabase";

const FinalResultsPage = () => {
  const { width, height } = useWindowSize();
  const [overallWinner, setOverallWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const calculateWinner = async () => {
      const { data: votesData, error } = await supabase.from("votes").select("votes");
      if (error || !votesData) {
        console.error("Error fetching votes:", error);
        return;
      }

      const taskWinners = {};

      // Tally votes per task
      votesData.forEach(({ votes }) => {
        Object.entries(votes).forEach(([taskIndex, participant]) => {
          if (!taskWinners[taskIndex]) taskWinners[taskIndex] = {};
          taskWinners[taskIndex][participant] = (taskWinners[taskIndex][participant] || 0) + 1;
        });
      });

      // Determine winner for each task
      const winnersByTask = Object.values(taskWinners).map((taskVoteMap) => {
        return Object.entries(taskVoteMap).reduce((top, [name, count]) => {
          return count > top.count ? { name, count } : top;
        }, { name: null, count: 0 }).name;
      });

      // Count wins
      const overallCounts = {};
      winnersByTask.forEach((winner) => {
        overallCounts[winner] = (overallCounts[winner] || 0) + 1;
      });

      // Determine overall winner
      const topWinner = Object.entries(overallCounts).reduce((top, [name, count]) => {
        return count > top.count ? { name, count } : top;
      }, { name: null, count: 0 }).name;

      setOverallWinner(topWinner);
    };

    calculateWinner();
  }, []);

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
