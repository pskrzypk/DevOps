const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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
    user: "myappuser",
    password: "1qaz2wsx",
    database: "myappdb",
    host: "mypostgres",
    port: "5432"
});

pgClient.on('error', () => {
    console.log("Postgres not connected");
});

pgClient.on('connect', () =>{
    console.log("Connected to Postgres server");
});

//pgClient.
//query('CREATE TABLE IF NOT EXISTS dywidenda (id SERIAL PRIMARY KEY, wartosc NUMERIC(10, 2));').
//catch((err) => {console.log(err)});

// rest
const PORT = 5000;

function calculateTax(rows)
{
    var str = "";

    for (i = 0; i < rows.length; i++)
    {
        str += "Id: "+ rows[i].id + ", Wartość: " + rows[i].wartosc + "zł, Rentowność: " + rows[i].rentownosc + "%, Podatek: " + rows[i].wartosc*rows[i].rentownosc*0.01*0.19+"zł\n";
    }

    return str;
}

app.get("/api", (req, res) => {
    var id = req.body['id'];

    if (!id)
    {
        pgClient.
        query('SELECT * FROM dywidenda;').
        then(result => {res.send(calculateTax(result.rows))}).
        //then(result => {console.log(calculateTax(result.rows))}).
        catch((err) => {console.log(err)});
    }
    else
    {

    }

    /*redisClient.get(id, (err, result) => {
        if (result == null)
        {
            pgClient.
            query('SELECT * FROM dywidenda WHERE id=' + id + ';').
            then(result => {res.send("Oczytana dywidenda z postgres: " + result.rows[0].wartosc)}).
            catch((err) => {console.log(err)});
        }
        else
        {
            res.send("Oczytana dywidenda z redis: " + result);
        }
    });*/
});

app.post('/api', (req, res) => {
    //var dywidenda = req.query['dywidenda'];
    var wartosc = req.body['wartosc'];
    var rentownosc = req.body['rentownosc'];

    pgClient.
    query('INSERT INTO dywidenda (wartosc, rentownosc) VALUES (' + wartosc + ',' + rentownosc + ') RETURNING id;').
    then(result => {redisClient.set(result.rows[0].id, JSON.stringify({wartosc : wartosc, rentownosc: rentownosc}))}).
    catch((err) => {console.log(err)});

    //res.send("Zapisana dywidenda: " + wartosc);
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})
