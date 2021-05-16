const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();

const appId = uuidv4();

const appPort = 5000;

app.get('/api', (req, res) => {
   res.send(`[${appId}] Hello from mybackend server`);
});

app.listen(appPort, err =>{
    console.log(`App listening on port ${appPort}`);
});
