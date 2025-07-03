// VotingPage.jsx
import React, { useState, useEffect } from "react";
import "./index.css";
import logo from "./logo.png";
import { supabase } from "./supabase";

const tasks = [
  "Wear the best 80s movie character costume",
  "Take the best celebrity selfie",
  "Get the standee to the coolest location",
  "Learn and perform the best party trick",
  "Create the coolest voicemail greeting",
  "Find and purchase the 'best' piece of art for under $20",
];

const participantsPerTask = [
  ["Feinstein", "Grasek", "Dowski", "Bonaparte", "C Clark", "T Clark", "Nuzzi", "KJ Clark", "Keane", "Bica", "B Clark/Rush", "Gelabert", "P Clark", "Pritchard"],
  ["Nuzzi", "T Clark", "Bica", "Bonaparte", "Keane", "Pritchard", "KJ Clark", "Feinstein", "P Clark", "B Clark/Rush", "C Clark", "Gelabert", "Grasek", "Dowski"],
  ["C Clark", "Keane", "Bonaparte", "Feinstein", "Gelabert", "P Clark", "Grasek", "Pritchard", "KJ Clark", "Nuzzi", "B Clark/Rush", "Dowski", "Bica", "T Clark"],
  ["Keane", "Grasek", "Gelabert", "Bonaparte", "P Clark", "Dowski", "B Clark/Rush", "Pritchard", "Nuzzi", "C Clark", "Feinstein", "KJ Clark", "T Clark", "Bica"],
  ["Feinstein", "Keane", "T Clark", "Bica", "Gelabert", "C Clark", "Grasek", "Dowski", "Bonaparte", "Nuzzi", "P Clark", "Pritchard", "B Clark/Rush", "KJ Clark"],
  ["B Clark/Rush", "Keane", "P Clark", "Dowski", "Grasek", "Bonaparte", "Feinstein", "Gelabert", "T Clark", "C Clark", "Bica", "Nuzzi", "KJ Clark", "Pritchard"],
];

function VotingPage() {
  const [currentTask, setCurrentTask] = useState(0);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTask]);

  const handleVote = (participant) => {
    setVotes((prev) => ({ ...prev, [currentTask]: participant }));
  };

  const handleNext = async () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask((prev) => prev + 1);
    } else {
      const storedVotes = JSON.parse(localStorage.getItem("allVotes")) || [];
      localStorage.setItem("allVotes", JSON.stringify([...storedVotes, votes]));

      try {
        const { error } = await supabase.from("votes").insert({
          voter_id: crypto.randomUUID(),
          votes,
        });
        if (error) throw error;
      } catch (err) {
        console.error("Error submitting vote:", err);
      }

      alert("Thanks for voting! Please notify the host that you're done.");
    }
  };

  return (
    <div className="relative p-4 max-w-3xl mx-auto min-h-screen font-special text-black">
      <div className="bg-stripe fixed inset-0 -z-10"></div>
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo" className="h-28 md:h-36" />
      </div>
      <div className="bg-white p-6 rounded shadow-xl relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-white text-stroke text-center">
          {tasks[currentTask].toUpperCase()}
        </h2>
        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto pb-20">
          {participantsPerTask[currentTask].map((participant) => (
            <div
              key={participant}
              onClick={() => handleVote(participant)}
              className={
                "cursor-pointer py-4 px-6 rounded-lg text-center font-bold text-2xl transition-all duration-200 uppercase shadow-xl relative z-10 " +
                (votes[currentTask] === participant
                  ? "border-4 border-yellow-500 scale-105 bg-yellow-100 text-black"
                  : "border-4 border-black bg-white text-black hover:bg-yellow-100")
              }
            >
              {participant}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-4">
        <button
          onClick={handleNext}
          disabled={!votes[currentTask]}
          className="bg-white text-black px-6 py-3 rounded font-bold uppercase shadow"
        >
          {currentTask < tasks.length - 1 ? "VOTE & NEXT TASK" : "SUBMIT"}
        </button>
      </div>
    </div>
  );
}

export default VotingPage;
