import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
    const savedTask = parseInt(localStorage.getItem("currentTask")) || 0;
    const submitted = localStorage.getItem("hasSubmitted") === "true";
    setVotes(savedVotes);
    setCurrentTask(submitted ? tasks.length - 1 : savedTask);
    setHasSubmitted(submitted);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTask]);

  const handleVote = (participant) => {
    const updatedVotes = { ...votes, [currentTask]: participant };
    setVotes(updatedVotes);
    localStorage.setItem("votes", JSON.stringify(updatedVotes));
    localStorage.setItem("currentTask", currentTask.toString());
  };

  const handleNext = async () => {
    if (hasSubmitted) {
      alert("You’ve already submitted your votes.");
      return;
    }

    if (currentTask < tasks.length - 1) {
      setCurrentTask((prev) => {
        const next = prev + 1;
        localStorage.setItem("currentTask", next.toString());
        return next;
      });
    } else {
      try {
        const { error } = await supabase.from("votes").insert({
          voter_id: crypto.randomUUID(),
          votes,
        });
        if (error) throw error;

        localStorage.removeItem("votes");
        localStorage.removeItem("currentTask");
        localStorage.setItem("hasSubmitted", "true");
        setHasSubmitted(true);
        setSubmittedMessage(true);
      } catch (err) {
        console.error("Error submitting vote:", err);
        alert("There was an error submitting your vote. Please try again.");
      }
    }
  };

  if (submittedMessage) {
    return (
      <div className="bg-stripe min-h-screen flex flex-col items-center justify-center text-center p-6">
        <img src={logo} alt="Logo" className="w-60 mb-6" />
        <h1 className="text-3xl font-bold text-white">THANKS FOR YOUR SUBMISSION!</h1>
      </div>
    );
  }

  return (
    <div className="relative p-4 max-w-3xl mx-auto min-h-screen font-special text-black">
      <div className="bg-stripe fixed inset-0 -z-10"></div>
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo" className="h-44 md:h-56" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTask}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded shadow-xl relative z-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black uppercase">
            TASK: <span className="text-yellow-600">{tasks[currentTask]}</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto pb-32">
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

          <div className="text-center mt-8">
            <button
              onClick={handleNext}
              disabled={!votes[currentTask] || hasSubmitted}
              className="bg-white text-black px-6 py-3 rounded font-bold uppercase shadow"
            >
              {currentTask < tasks.length - 1 ? "VOTE & NEXT TASK" : "SUBMIT"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default VotingPage;
