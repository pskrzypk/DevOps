const express = require("express");

const app = express();

app.get('/api', (req, res) => {
    res.send("Hello World from express server");
});

app.post('/api', (req, res) => {
    var dywidenda = req.query['dywidenda'];

    res.send("Zapisana dywidenda: " + dywidenda);
});

const PORT = 9090;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})

