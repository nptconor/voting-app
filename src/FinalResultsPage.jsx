// FinalResultsPage.jsx
import React, { useEffect, useState } from "react";
import logo from "./logo.png";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { supabase } from "./supabase";

const FinalResultsPage = () => {
  const { width, height } = useWindowSize();
  const [votes, setVotes] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase.from("votes").select("votes");
      if (error) return console.error(error);

      const taskWinners = Array(6).fill(null);
      const tallyByTask = Array(6).fill(null).map(() => ({}));

      data.forEach(({ votes }) => {
        Object.entries(votes).forEach(([taskIndex, name]) => {
          if (!tallyByTask[taskIndex][name]) tallyByTask[taskIndex][name] = 0;
          tallyByTask[taskIndex][name]++;
        });
      });

      const overallCount = {};
      tallyByTask.forEach((tally) => {
        const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
        if (top) {
          overallCount[top[0]] = (overallCount[top[0]] || 0) + 1;
        }
      });

      const overall = Object.entries(overallCount).sort((a, b) => b[1] - a[1])[0];
      setWinner(overall ? overall[0] : "No overall winner");
    };

    fetchVotes();
    const timer = setTimeout(() => setShowConfetti(false), 20000);
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
      <motion.p
        className="text-4xl md:text-5xl font-extrabold text-yellow-300 mt-6 drop-shadow-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {winner}
      </motion.p>
    </div>
  );
};

export default FinalResultsPage;
