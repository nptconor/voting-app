// ResultsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import logo from "./logo.png";
import { motion, AnimatePresence } from "framer-motion";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    const { data, error } = await supabase.from("votes").select("votes");
    if (error) console.error(error);
    else setResults(data.map((entry) => entry.votes));
  }

  function getTaskWinner(taskIndex) {
    const tally = {};
    results.forEach((vote) => {
      const name = vote[taskIndex];
      if (name) tally[name] = (tally[name] || 0) + 1;
    });
    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    return sorted.length ? `${sorted[0][0]} (${sorted[0][1]} votes)` : "No votes yet";
  }

  const handleClearVotes = async () => {
    const confirm = window.confirm("Are you sure you want to clear all votes?");
    if (confirm) {
      await supabase.from("votes").delete().neq("id", 0);
      alert("All votes cleared.");
      fetchResults();
    }
  };

  return (
    <div className="min-h-screen bg-stripe text-black flex flex-col items-center p-6">
      <img src={logo} alt="Logo" className="w-48 mb-8" />

      {!admin ? (
        <div className="mb-10">
          <input
            type="password"
            placeholder="Enter admin password"
            className="px-4 py-2 rounded border border-black mr-2"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (passwordInput === "avatar22") setAdmin(true);
              else alert("Incorrect password.");
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Enter Admin Mode
          </button>
        </div>
      ) : (
        <button
          onClick={handleClearVotes}
          className="mb-10 bg-red-500 text-white px-4 py-2 rounded font-bold"
        >
          CLEAR ALL VOTES
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTask}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white border-4 border-black rounded-xl p-6 shadow-xl max-w-2xl text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-yellow-600 mb-4">
            Task {currentTask + 1}
          </h2>
          <p className="text-lg md:text-xl font-semibold mb-4">
            {tasks[currentTask]}
          </p>
          <p className="text-2xl md:text-3xl font-extrabold text-black">
            Winner: {getTaskWinner(currentTask)}
          </p>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentTask((prev) => Math.max(0, prev - 1))}
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={currentTask === 0}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentTask((prev) => Math.min(tasks.length - 1, prev + 1))}
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={currentTask === tasks.length - 1}
            >
              Next
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ResultsPage;
