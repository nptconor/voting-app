// ResultsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

const ADMIN_PASSWORD = "avatar22"; // change this as needed

function ResultsPage() {
  const [votesData, setVotesData] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase.from("votes").select("*");
      if (!error) setVotesData(data || []);
    }
    fetchVotes();
  }, []);

  const calculateTopThree = (taskIndex) => {
    const tally = {};
    votesData.forEach((vote) => {
      const selection = vote.votes[taskIndex];
      if (selection) {
        tally[selection] = (tally[selection] || 0) + 1;
      }
    });

    const sorted = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return sorted;
  };

  const handleNextTask = () => {
    setCurrentTaskIndex((prev) => prev + 1);
  };

  const handleClearVotes = async () => {
    const confirmClear = window.confirm("Are you sure you want to delete all votes?");
    if (!confirmClear) return;

    setClearing(true);
    const { error } = await supabase.from("votes").delete().neq("voter_id", "");
    setClearing(false);

    if (error) {
      alert("Failed to clear votes.");
    } else {
      alert("Votes cleared.");
      window.location.reload();
    }
  };

  const handleAdminLogin = () => {
    const input = prompt("Enter admin password:");
    if (input === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
    } else {
      alert("Incorrect password.");
    }
  };

  const topThree = calculateTopThree(currentTaskIndex);

  return (
    <div className="min-h-screen bg-stripe text-white flex flex-col items-center justify-center px-6 py-10 font-bold text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTaskIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="bg-black bg-opacity-80 p-6 rounded-lg w-full max-w-xl"
        >
          <h2 className="text-2xl sm:text-3xl mb-6 uppercase">
            Task {currentTaskIndex + 1}: {tasks[currentTaskIndex]}
          </h2>

          {topThree.length === 0 ? (
            <p className="text-lg">No votes yet.</p>
          ) : (
            <ul className="text-yellow-300 text-xl space-y-2">
              {topThree.map(([name, count], index) => (
                <li key={index}>
                  {index + 1}. {name} – {count} vote{count !== 1 ? "s" : ""}
                </li>
              ))}
            </ul>
          )}

          {currentTaskIndex < tasks.length - 1 ? (
            <button
              onClick={handleNextTask}
              className="mt-6 bg-yellow-400 text-black py-2 px-6 rounded-full hover:bg-white transition font-bold"
            >
              Show Next Task
            </button>
          ) : (
            <button
              onClick={() => navigate("/final")}
              className="mt-6 bg-white text-black py-2 px-6 rounded-full hover:bg-yellow-400 transition font-bold"
            >
              View Final Results
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8">
        {!adminUnlocked ? (
          <button
            onClick={handleAdminLogin}
            className="text-sm underline text-white hover:text-yellow-300"
          >
            Admin? Click to log in
          </button>
        ) : (
          <button
            onClick={handleClearVotes}
            className="text-sm underline text-red-300 hover:text-red-500"
            disabled={clearing}
          >
            {clearing ? "Clearing votes..." : "Clear All Votes"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
