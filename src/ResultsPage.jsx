import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
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
  const [taskResults, setTaskResults] = useState([]);

  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase.from("votes").select("votes");
      if (error) {
        console.error("Error fetching votes:", error);
        return;
      }

      const voteData = data.map((entry) => entry.votes);
      const tallies = tasks.map((_, taskIndex) => {
        const count = {};
        voteData.forEach((vote) => {
          const name = vote[taskIndex];
          if (name) {
            count[name] = (count[name] || 0) + 1;
          }
        });
        const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
        return sorted;
      });

      setTaskResults(tallies);
    }

    fetchVotes();
  }, []);

  return (
    <div className="min-h-screen bg-stripe text-white p-6">
      <div className="max-w-3xl mx-auto space-y-12 pt-12">
        <AnimatePresence>
          {taskResults.map((result, i) => (
            <motion.div
              key={i}
              className="bg-black p-6 rounded shadow text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 + 0.1 }}
              >
                TASK {i + 1}: {tasks[i].toUpperCase()}
              </motion.h2>
              {result.map(([name, votes], idx) => (
                <motion.p
                  key={name}
                  className={`text-lg md:text-xl ${idx === 0 ? "font-bold text-yellow-400" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.2 + 0.2 + idx * 0.1 }}
                >
                  {name} — {votes} vote{votes !== 1 ? "s" : ""}
                </motion.p>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ResultsPage;
