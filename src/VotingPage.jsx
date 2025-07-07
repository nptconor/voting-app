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
  ["Feinsteins", "McDonalds", "Jay Dowski", "Bones", "Conor Clark", "Terry Clark", "Nuzzis", "Kelly & Jim Clark", "Konall Keane", "Joey Bica", "Bridget & Sara", "Gelaberts", "PJ Clark", "Ian Pritchard"],
  ["Nuzzis", "Terry Clark", "Joey Bica", "Bones", "Konall Keane", "Ian Pritchard", "Kelly & Jim Clark", "Feinsteins", "PJ Clark", "Bridget & Sara", "Conor Clark", "Gelaberts", "McDonalds", "Jay Dowski"],
  ["Conor Clark", "Konall Keane", "Bones", "Feinsteins", "Gelaberts", "PJ Clark", "McDonalds", "Ian Pritchard", "Kelly & Jim Clark", "Nuzzis", "Bridget & Sara", "Jay Dowski", "Joey Bica", "Terry Clark"],
  ["Konall Keane", "McDonalds", "Gelaberts", "Bones", "PJ Clark", "Jay Dowski", "Bridget & Sara", "Ian Pritchard", "Nuzzis", "Conor Clark", "Feinsteins", "Kelly & Jim Clark", "Terry Clark", "Joey Bica"],
  ["Feinsteins", "Konall Keane", "Terry Clark", "Joey Bica", "Gelaberts", "Conor Clark", "McDonalds", "Jay Dowski", "Bones", "Nuzzis", "PJ Clark", "Ian Pritchard", "Bridget & Sara", "Kelly & Jim Clark"],
  ["Bridget & Sara", "Konall Keane", "PJ Clark", "Jay Dowski", "McDonalds", "Bones", "Feinsteins", "Gelaberts", "Terry Clark", "Conor Clark", "Joey Bica", "Nuzzis", "Kelly & Jim Clark", "Ian Pritchard"],
];

function VotingPage() {
  const [currentTask, setCurrentTask] = useState(0);
  const [votes, setVotes] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [voterId, setVoterId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem("voter_id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("voter_id", id);
      }
      setVoterId(id);

      const { data, error } = await supabase
        .from("votes")
        .select("voter_id")
        .eq("voter_id", id);

      if (error) {
        console.error("Supabase error:", error);
        setLoading(false);
        return;
      }

      if (data.length > 0) {
        // already voted
        setHasSubmitted(true);
        setCurrentTask(tasks.length - 1);
      } else {
        // hasn't voted yet
        const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
        const savedTask = parseInt(localStorage.getItem("currentTask")) || 0;
        setVotes(savedVotes);
        setCurrentTask(savedTask);
      }

      setLoading(false);
    };

    init();
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
          voter_id: voterId,
          votes,
        });
        if (error) throw error;

        localStorage.removeItem("votes");
        localStorage.removeItem("currentTask");
        setHasSubmitted(true);
        setSubmittedMessage(true);
      } catch (err) {
        console.error("Error submitting vote:", err);
        alert("There was an error submitting your vote. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stripe text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

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
