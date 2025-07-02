// ResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import logo from "./logo.png";
import "./index.css";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

const ADMIN_SECRET = "your_secret_here";

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

function getTop3(tally) {
  return Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
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
  return { taskWinners, overallWinners };
}

export default function ResultsPage() {
  const [taskTallies, setTaskTallies] = useState([]);
  const [taskWinners, setTaskWinners] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
  const [adminMode, setAdminMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase.from("votes").select("*");
      if (error) {
        console.error("Failed to fetch votes:", error);
        return;
      }
      const tallies = tallyVotes(data);
      setTaskTallies(tallies);
      const { taskWinners } = getWinners(tallies);
      setTaskWinners(taskWinners);
    }
    fetchVotes();
  }, []);

  const revealNext = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
    } else {
      navigate("/final");
    }
  };

  const enableAdmin = () => {
    const ok = prompt("Enter admin secret:") === ADMIN_SECRET;
    if (ok) setAdminMode(true);
    else alert("Incorrect secret.");
  };

  const clearVotes = async () => {
    if (!window.confirm("Are you sure you want to clear all votes?")) return;
    const { error } = await supabase.from("votes").delete().neq("voter_id", "");
    if (error) {
      console.error("Error clearing votes:", error);
      alert("Failed to clear votes.");
    } else {
      alert("✅ Votes cleared!");
      setTaskTallies([]);
      setTaskWinners([]);
      setCurrentTaskIndex(-1);
    }
  };

  return (
    <div className="relative p-4 max-w-4xl mx-auto min-h-screen font-special text-black">
      <div className="bg-stripe fixed inset-0 -z-10"></div>
      <img src={logo} alt="Game Changer Clark Edition Logo" className="w-72 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-center mb-8 text-white text-stroke">RESULTS</h1>

      {currentTaskIndex >= 0 && taskTallies[currentTaskIndex] && (
        <div className="mb-8 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">
            {tasks[currentTaskIndex].toUpperCase()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getTop3(taskTallies[currentTaskIndex]).map(([name, count], i) => (
              <div
                key={name}
                className={`p-4 rounded text-center font-bold text-xl uppercase border-4 shadow ${
                  taskWinners[currentTaskIndex]?.includes(name)
                    ? "border-yellow-500 bg-yellow-100 scale-105"
                    : "border-black bg-white"
                }`}
              >
                {i + 1}. {name}
                <div className="text-sm font-normal">Votes: {count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={revealNext}
          className="bg-white text-black px-6 py-3 rounded font-bold uppercase shadow"
        >
          {currentTaskIndex === -1 ? "Start Reveal" : "Next Task"}
        </button>
      </div>

      {!adminMode && (
        <div className="text-center mt-6">
          <button
            onClick={enableAdmin}
            className="bg-gray-700 text-white px-4 py-2 rounded font-semibold"
          >
            Admin Access
          </button>
        </div>
      )}
      {adminMode && (
        <div className="text-center mt-6">
          <button
            onClick={clearVotes}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded font-semibold"
          >
            Clear All Votes
          </button>
        </div>
      )}
    </div>
  );
}
