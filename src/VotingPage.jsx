// VotingPage.jsx
import React, { useState } from "react";
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

export default function VotingPage() {
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (taskIndex, name) => {
    setVotes((prev) => ({ ...prev, [taskIndex]: name }));
  };

  const handleSubmit = async () => {
    const voterId = crypto.randomUUID();
    const { error } = await supabase.from("votes").insert([
      {
        voter_id: voterId,
        votes: votes,
      },
    ]);
    if (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit votes.");
    } else {
      setSubmitted(true);
      alert("Thanks for voting! Please notify the host that you're done.");
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ Scroll to top
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stripe font-special">
        <img src={logo} alt="Game Changer Logo" className="w-72 mb-8" />
        <h1 className="text-3xl font-bold text-white text-stroke mb-4">
          Thanks for voting!
        </h1>
        <p className="text-white">Please notify the host that you're done.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen bg-stripe font-special text-black">
      <img src={logo} alt="Game Changer Logo" className="w-72 mx-auto mb-8" />

      {tasks.map((task, taskIndex) => (
        <div
          key={taskIndex}
          className="mb-8 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-black">
            {task.toUpperCase()}
          </h2>
          <input
            type="text"
            placeholder="Enter your vote..."
            value={votes[taskIndex] || ""}
            onChange={(e) => handleVote(taskIndex, e.target.value)}
            className="w-full px-4 py-2 rounded border border-black"
          />
        </div>
      ))}

      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-white text-black px-6 py-3 rounded font-bold uppercase shadow"
        >
          Submit Votes
        </button>
      </div>
    </div>
  );
}
