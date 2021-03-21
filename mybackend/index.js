const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

var globalid = 1

// redis
const redis = require('redis');

const redisClient = redis.createClient({
    host: "myredis",
    port: 6379,
    // retry_strategy: () => 1000
});

redisClient.on('connect', () =>{
    console.log("Connected to Redis server");
});

// postgres
const { Pool } = require('pg');

const pgClient = new Pool({
    user: "postgres",
    password: "1qaz2wsx",
    database: "postgres",
    host: "mypostgres",
    port: "5432"
});

pgClient.on('error', () => {
    console.log("Postgres not connected");
});

pgClient.on('connect', () =>{
    console.log("Connected to Postgres server");
});

pgClient.
query('CREATE TABLE IF NOT EXISTS dywidenda (id SERIAL PRIMARY KEY, wartosc NUMERIC(10, 2));').
catch((err) => {console.log(err)});

pgClient.
query('SELECT MAX(id) FROM dywidenda;').
then(result => {
    globalid = result.rows[0].max;
    globalid++;
    console.log("Setting globalid to: " + globalid);
}).
catch((err) => {console.log(err)});

// rest
const PORT = 5000;

app.get("/api", (req, res) => {
    var id = req.query['id'];


    redisClient.get(id, (err, result) => {
        if (result == null)
        {
            pgClient.
            query('SELECT wartosc FROM dywidenda WHERE id=' + id + ';').
            then(result => {res.send("Oczytana dywidenda z postgres: " + result.rows[0].wartosc)}).
            catch((err) => {console.log(err)});
        }
        else
        {
            res.send("Oczytana dywidenda z redis: " + result);
        }
    });
});

app.post('/api', (req, res) => {
    var dywidenda = req.query['dywidenda'];

    redisClient.set(globalid, dywidenda);
    globalid++;

    pgClient.
    query('INSERT INTO dywidenda (wartosc)VALUES (' + dywidenda + ');').
    catch((err) => {console.log(err)});


    res.send("Zapisana dywidenda: " + dywidenda);
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})
