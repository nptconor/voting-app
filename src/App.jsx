// This is your App.jsx (inside src/ folder)
import React, { useState } from "react";
import "./index.css"; // Ensure custom styles are applied

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

function App() {
  const [currentTask, setCurrentTask] = useState(0);
  const [votes, setVotes] = useState({});
  const [scoreboard, setScoreboard] = useState({});
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (participant) => {
    setVotes((prev) => ({ ...prev, [currentTask]: participant }));
  };

  const handleNext = () => {
    const votedFor = votes[currentTask];
    if (votedFor) {
      setScoreboard((prev) => ({
        ...prev,
        [votedFor]: (prev[votedFor] || 0) + 1,
      }));
    }
    setShowScoreboard(true);
  };

  const handleContinue = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask((prev) => prev + 1);
      setShowScoreboard(false);
    } else {
      setShowScoreboard(false);
      setSubmitted(true);
      console.log("Final Votes:", votes);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 text-center bg-stripe h-screen text-white font-special">
        <h2 className="text-3xl font-bold text-stroke">Thank you for voting!</h2>
        <p className="mt-4 text-xl">Your responses have been recorded.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto bg-stripe min-h-screen text-white font-special">
      <h1 className="text-4xl font-bold text-center mb-6 text-stroke">Challenge Voting</h1>
      {!showScoreboard ? (
        <div className="bg-white bg-opacity-10 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-stroke">{tasks[currentTask]}</h2>
          {participantsPerTask[currentTask].map((participant) => (
            <div key={participant} className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                id={`${currentTask}-${participant}`}
                name="vote"
                value={participant}
                onChange={() => handleVote(participant)}
                checked={votes[currentTask] === participant}
              />
              <label htmlFor={`${currentTask}-${participant}`}>{participant}</label>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white bg-opacity-10 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-stroke">Live Scoreboard</h2>
          {Object.entries(scoreboard).map(([name, score]) => (
            <div key={name} className="flex justify-between py-1">
              <span>{name}</span>
              <span>{score}</span>
            </div>
          ))}
        </div>
      )}
      <div className="text-center mt-4">
        {!showScoreboard ? (
          <button onClick={handleNext} disabled={!votes[currentTask]} className="bg-white text-black px-4 py-2 rounded font-bold">
            {currentTask < tasks.length - 1 ? "Vote & View Scoreboard" : "Vote & View Final Scoreboard"}
          </button>
        ) : (
          <button onClick={handleContinue} className="bg-white text-black px-4 py-2 rounded font-bold">
            {currentTask < tasks.length - 1 ? "Next Task" : "Submit Votes"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
