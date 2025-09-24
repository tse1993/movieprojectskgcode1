const express = require("express");

const app = express();
const PORT = 3000;

//Route
app.get("/", (req, res) => {
    req.send("Welcome to the node server!!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});