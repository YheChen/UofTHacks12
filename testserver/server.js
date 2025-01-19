const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let counter = 0; // Counter value

// Endpoint to get the current counter value
app.get("/counter", (req, res) => {
  res.json({ counter });
});

// Endpoint to increment the counter
app.post("/counter/increment", (req, res) => {
  counter++;
  res.json({ success: true, counter });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
