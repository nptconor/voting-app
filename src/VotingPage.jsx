import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "./logo.png";

const VotingPage = () => {
  const [votes, setVotes] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const tasks = [
    ["Feinstein", "Grasek", "Dowski", "Bonaparte", "C Clark", "T Clark", "Nuzzi", "KJ Clark", "Keane", "Bica", "B Clark/Rush", "Gelabert", "P Clark", "Pritchard"],
    ["Nuzzi", "T Clark", "Bica", "Bonaparte", "Keane", "Pritchard", "KJ Clark", "Feinstein", "P Clark", "B Clark/Rush", "C Clark", "Gelabert", "Grasek", "Dowski"],
    ["C Clark", "Keane", "Bonaparte", "Feinstein", "Gelabert", "P Clark", "Grasek", "Pritchard", "KJ Clark", "Nuzzi", "B Clark/Rush", "Dowski", "Bica", "T Clark"],
    ["Keane", "Grasek", "Gelabert", "Bonaparte", "P Clark", "Dowski", "B Clark/Rush", "Pritchard", "Nuzzi", "C Clark", "Feinstein", "KJ Clark", "T Clark", "Bica"],
    ["Feinstein", "Keane", "T Clark", "Bica", "Gelabert", "C Clark", "Grasek", "Dowski", "Bonaparte", "Nuzzi", "P Clark", "Pritchard", "B Clark/Rush", "KJ Clark"],
    ["B Clark/Rush", "Keane", "P Clark", "Dowski", "Grasek", "Bonaparte", "Feinstein", "Gelabert", "T Clark", "C Clark", "Bica", "Nuzzi", "KJ Clark", "Pritchard"]
  ];

  const handleVote = (vote) => {
    const newVotes = [...votes];
    newVotes[currentTaskIndex] = vote;
    setVotes(newVotes);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const supabaseUrl = "https://rdjikkoukowuxprmuyde.supabase.co";
    const supabaseKey = "your_supabase_key_here";
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("votes").insert({
      voter_id: crypto.randomUUID(),
      votes,
    });

    if (error) {
      console.error("Error submitting votes:", error);
    } else {
      window.location.href = "/results";
    }
  };

  return (
    <motion.div
      className="voting-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img src={logo} alt="Logo" style={{ maxWidth: "80%", margin: "0 auto", display: "block" }} />
      <h2 style={{ textTransform: "uppercase", textAlign: "center", marginTop: "1rem" }}>
        Task {currentTaskIndex + 1}
      </h2>
      <ul>
        {tasks[currentTaskIndex].map((name, i) => (
          <li key={i} onClick={() => handleVote(name)}>{name}</li>
        ))}
      </ul>
      <div style={{ marginBottom: "60px" }} /> {/* space above button */}
      <button
        onClick={() => {
          if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            handleSubmit();
          }
        }}
      >
        {currentTaskIndex < tasks.length - 1 ? "Next Task" : "Submit Votes"}
      </button>
    </motion.div>
  );
};

export default VotingPage;
