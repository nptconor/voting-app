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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const calculateWinner = async () => {
      try {
        const { data: votesData, error } = await supabase.from("votes").select("votes");
        if (error || !votesData) {
          console.error("Error fetching votes:", error);
          setLoading(false);
          return;
        }

        const taskWinners = {};

        votesData.forEach(({ votes }) => {
          Object.entries(votes).forEach(([taskIndex, participant]) => {
            if (!taskWinners[taskIndex]) taskWinners[taskIndex] = {};
            taskWinners[taskIndex][participant] = (taskWinners[taskIndex][participant] || 0) + 1;
          });
        });

        const winnersByTask = Object.values(taskWinners).map((taskVoteMap) => {
          return Object.entries(taskVoteMap).reduce((top, [name, count]) => {
            return count > top.count ? { name, count } : top;
          }, { name: null, count: 0 }).name;
        });

        const overallCounts = {};
        winnersByTask.forEach((winner) => {
          overallCounts[winner] = (overallCounts[winner] || 0) + 1;
        });

        const topWinner = Object.entries(overallCounts).reduce((top, [name, count]) => {
          return count > top.count ? { name, count } : top;
        }, { name: null, count: 0 }).name;

        setOverallWinner(topWinner);
      } catch (err) {
        console.error("Error calculating winner:", err);
      } finally {
        setLoading(false);
      }
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

      {loading ? (
        <p className="text-2xl mt-4 text-white">Loading results...</p>
      ) : overallWinner ? (
        <motion.p
          className="text-4xl md:text-5xl font-extrabold text-yellow-300 mt-6 drop-shadow-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {overallWinner}
        </motion.p>
      ) : (
        <p className="text-xl mt-6 text-white">No winner data available.</p>
      )}
    </div>
  );
};

export default FinalResultsPage;
