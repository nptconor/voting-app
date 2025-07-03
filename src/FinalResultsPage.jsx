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
      const { data, error } = await supabase.from("votes").select("votes");

      if (error) {
        console.error("Failed to fetch votes:", error);
        setLoading(false);
        return;
      }

      const taskVoteCounts = {};

      data.forEach(({ votes }) => {
        Object.entries(votes).forEach(([taskIdx, participant]) => {
          if (!taskVoteCounts[taskIdx]) taskVoteCounts[taskIdx] = {};
          taskVoteCounts[taskIdx][participant] = (taskVoteCounts[taskIdx][participant] || 0) + 1;
        });
      });

      const taskWinners = Object.values(taskVoteCounts).map((voteMap) => {
        return Object.entries(voteMap).reduce(
          (top, [name, count]) => (count > top.count ? { name, count } : top),
          { name: "", count: 0 }
        ).name;
      });

      const finalCounts = {};
      taskWinners.forEach((winner) => {
        finalCounts[winner] = (finalCounts[winner] || 0) + 1;
      });

      const topWinner = Object.entries(finalCounts).reduce(
        (top, [name, count]) => (count > top.count ? { name, count } : top),
        { name: "", count: 0 }
      ).name;

      setOverallWinner(topWinner);
      setLoading(false);
    };

    calculateWinner();
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
      {loading ? (
        <p className="text-xl text-white mt-4">Calculating votes...</p>
      ) : (
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
