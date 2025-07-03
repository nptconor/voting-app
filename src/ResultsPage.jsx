// ResultsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./logo.png";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase.from("votes").select();
      if (error) {
        console.error("Error fetching votes:", error);
        return;
      }

      const voteCounts = tasks.map((_, taskIndex) => {
        const countMap = {};
        data.forEach(({ votes }) => {
          const vote = votes[taskIndex];
          if (vote) countMap[vote] = (countMap[vote] || 0) + 1;
        });
        return Object.entries(countMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
      });

      setResults(voteCounts);
    };

    fetchVotes();
  }, []);

  const clearVotes = async () => {
    const { error } = await supabase.from("votes").delete().neq("id", 0);
    if (error) {
      console.error("Error clearing votes:", error);
    } else {
      alert("All votes cleared.");
      setResults([]);
    }
  };

  const handleAdminLogin = () => {
    if (password === "avatar22") setAdminMode(true);
    else alert("Incorrect password");
  };

  return (
    <div className="bg-stripe min-h-screen text-black flex flex-col items-center justify-center px-6 py-12">
      <img src={logo} alt="Logo" className="w-56 sm:w-72 mb-10" />
      <div className="bg-white border-4 border-black rounded-2xl p-6 max-w-2xl w-full text-center shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTaskIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase">
              TASK {currentTaskIndex + 1}
            </h2>
            <p className="text-lg md:text-xl mb-6">
              {tasks[currentTaskIndex]}
            </p>
            <ol className="text-left space-y-3 text-xl font-semibold">
              {results[currentTaskIndex]?.map(([name, count], i) => (
                <li key={i} className="bg-yellow-100 border-2 border-black p-3 rounded-xl">
                  {i + 1}. {name} — {count} vote{count !== 1 ? "s" : ""}
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-center space-x-4">
          {currentTaskIndex > 0 && (
            <button
              onClick={() => setCurrentTaskIndex((i) => i - 1)}
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              PREV
            </button>
          )}
          {currentTaskIndex < tasks.length - 1 ? (
            <button
              onClick={() => setCurrentTaskIndex((i) => i + 1)}
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              NEXT
            </button>
          ) : (
            <a
              href="/final"
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              SEE FINAL RESULTS
            </a>
          )}
        </div>
        {!adminMode && (
          <div className="mt-6 text-sm text-gray-600">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-1 rounded border border-gray-400"
            />
            <button
              onClick={handleAdminLogin}
              className="ml-2 px-3 py-1 bg-black text-white rounded hover:bg-yellow-400 hover:text-black"
            >
              Login
            </button>
          </div>
        )}
        {adminMode && (
          <div className="mt-6">
            <button
              onClick={clearVotes}
              className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-400 transition"
            >
              Clear All Votes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
