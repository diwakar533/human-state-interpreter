const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/*
  This system avoids diagnosis and respects emotional safety.
  It interprets patterns gently and never evaluates the user.
*/

let sessions = {};

// START SESSION
app.post("/session/start", (req, res) => {
  const sessionId = Date.now().toString();
  sessions[sessionId] = { answers: [] };
  res.json({ sessionId });
});

// SAVE ANSWER
app.post("/session/answer", (req, res) => {
  const { sessionId, answerIndex } = req.body;
  if (sessions[sessionId]) {
    sessions[sessionId].answers.push(answerIndex);
  }
  res.json({ status: "stored" });
});

// INTERPRET STATE
app.post("/session/interpret", (req, res) => {
  const { sessionId } = req.body;
  const answers = sessions[sessionId]?.answers || [];

  let score = answers.reduce((a, b) => a + b, 0);

  let state, message, guidance;

  if (score <= 3) {
    state = "Balanced State";
    message = "This state often appears when things are holding together in a steady way.";
    guidance = "You may benefit from continuing what is already supporting you.";
  } else if (score <= 6) {
    state = "Draining State";
    message = "This state can appear when energy has been going outward more than inward.";
    guidance = "Gentle rest and small moments of care can help restore balance.";
  } else {
    state = "Recovery Needed";
    message = "This state often appears when your system has been carrying more than it can comfortably hold.";
    guidance = "Slowing down and allowing space to recover may be supportive right now.";
  }

  res.json({ state, message, guidance });
});

// QUIET CHAT ACKNOWLEDGEMENT
app.post("/chat/acknowledge", (req, res) => {
  const responses = [
    "Thank you for sharing.",
    "This space is holding what you wrote.",
    "You’re not alone here."
  ];
  const reply = responses[Math.floor(Math.random() * responses.length)];
  res.json({ message: reply });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
