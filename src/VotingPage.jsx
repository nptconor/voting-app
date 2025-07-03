import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import supabase from "./supabase";
import logo from "./logo.png";

const tasks = [
  ["Feinstein", "Grasek", "Dowski", "Bonaparte", "C Clark", "T Clark", "Nuzzi", "KJ Clark", "Keane", "Bica", "B Clark/Rush", "Gelabert", "P Clark", "Pritchard"],
  ["Nuzzi", "T Clark", "Bica", "Bonaparte", "Keane", "Pritchard", "KJ Clark", "Feinstein", "P Clark", "B Clark/Rush", "C Clark", "Gelabert", "Grasek", "Dowski"],
  ["C Clark", "Keane", "Bonaparte", "Feinstein", "Gelabert", "P Clark", "Grasek", "Pritchard", "KJ Clark", "Nuzzi", "B Clark/Rush", "Dowski", "Bica", "T Clark"],
  ["Keane", "Grasek", "Gelabert", "Bonaparte", "P Clark", "Dowski", "B Clark/Rush", "Pritchard", "Nuzzi", "C Clark", "Feinstein", "KJ Clark", "T Clark", "Bica"],
  ["Feinstein", "Keane", "T Clark", "Bica", "Gelabert", "C Clark", "Grasek", "Dowski", "Bonaparte", "Nuzzi", "P Clark", "Pritchard", "B Clark/Rush", "KJ Clark"],
  ["B Clark/Rush", "Keane", "P Clark", "Dowski", "Grasek", "Bonaparte", "Feinstein", "Gelabert", "T Clark", "C Clark", "Bica", "Nuzzi", "KJ Clark", "Pritchard"],
];

export default function VotingPage() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [votes, setVotes] = useState([]);
  const [selected, setSelected] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedVotes = localStorage.getItem("votes");
    if (storedVotes) setVotes(JSON.parse(storedVotes));
  }, []);

  const handleSelect = (choice) => {
    setSelected(choice);
  };

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    const updatedVotes = [...votes, selected];
    localStorage.setItem("votes", JSON.stringify(updatedVotes));

    if (currentTaskIndex === tasks.length - 1) {
      setSubmitting(true);
      const { error } = await supabase.from("votes").insert([
        {
          voter_id: crypto.randomUUID(),
          votes: updatedVotes,
        },
      ]);
      setSubmitting(false);
      localStorage.removeItem("votes");
      if (error) {
        console.error("Error submitting votes:", error);
      } else {
        navigate("/results");
      }
    } else {
      setVotes(updatedVotes);
      setSelected("");
      setCurrentTaskIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const taskOptions = tasks[currentTaskIndex];

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="flex justify-center mb-8">
        <img src={logo} alt="Logo" className="w-64 md:w-80" />
      </div>

      <motion.div
        key={currentTaskIndex}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 tracking-widest text-gray-800">
          TASK {currentTaskIndex + 1}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
          {taskOptions.map((name, index) => (
            <motion.button
              key={index}
              onClick={() => handleSelect(name)}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-lg font-medium ${
                selected === name
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-900 border-gray-300"
              }`}
            >
              {name}
            </motion.button>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            disabled={!selected || submitting}
            onClick={handleSubmit}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {currentTaskIndex === tasks.length - 1 ? "Submit Final Vote" : "Next Task"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
