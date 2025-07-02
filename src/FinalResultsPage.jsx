// FinalResultsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./index.css";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

function tallyVotes(allVotes) {
  const taskTallies = Array(tasks.length).fill(null).map(() => ({}));
  allVotes.forEach((voteObj) => {
    const taskVotes = voteObj.votes;
    for (const [taskIndex, participant] of Object.entries(taskVotes)) {
      if (!taskTallies[taskIndex][participant]) {
        taskTallies[taskIndex][participant] = 0;
      }
      taskTallies[taskIndex][participant]++;
    }
  });
  return taskTallies;
}

function getWinners(tallies) {
  const taskWinners = tallies.map((tally) => {
    const entries = Object.entries(tally);
    const maxVotes = Math.max(...entries.map(([, count]) => count));
    const winners = entries.filter(([, count]) => count === maxVotes).map(([name]) => name);
    return winners;
  });
  const overallCounts = {};
  taskWinners.flat().forEach((name) => {
    overallCounts[name] = (overallCounts[name] || 0) + 1;
  });
  const maxOverall = Math.max(...Object.values(overallCounts));
  const overallWinners = Object.entries(overallCounts)
    .filter(([, count]) => count === maxOverall)
    .map(([name]) => name);
  return { overallCounts, overallWinners };
}

export default function FinalResultsPage() {
  const [overallCounts, setOverallCounts] = useState(null);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
  async function fetchVotes() {
    const { data, error } = await supabase.from("votes").select("*");
    if (error) {
      console.error("Failed to fetch votes:", error);
      return;
    }
    const tallies = tallyVotes(data);
    const { overallWinners } = getWinners(tallies);
    setOverallWinners(overallWinners);
  }
  fetchVotes();
}, []);

  return (
    <div className="relative p-4 max-w-4xl mx-auto min-h-screen font-special text-black">
      <div className="bg-stripe fixed inset-0 -z-10"></div>
      <h1 className="text-4xl font-bold text-center mb-8 text-white text-stroke">OVERALL WINNER</h1>

      {winners.length > 0 && (
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 {winners.join(" & ")} 🎉</h2>
          <p className="mb-4">With the most task wins overall!</p>
          <ul className="text-left inline-block">
            {Object.entries(overallCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => (
                <li
                  key={name}
                  className={`font-bold py-1 px-2 rounded ${winners.includes(name) ? "bg-yellow-100" : ""}`}
                >
                  {name}: {count} task win{count > 1 ? "s" : ""}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
