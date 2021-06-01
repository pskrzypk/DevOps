const express = require('express');
const cors = require('cors');
const keys = require('./keys');

const app = express();

app.use(cors());
app.use(express.json());

// redis
const redis = require('redis');

const redisClient = redis.createClient({
    host: "myredis",
    port: 6379,
    retry_strategy: () => 1000
});

redisClient.on('connect', () =>{
    console.log("Connected to Redis server");
});

// postgres
const { Pool } = require('pg');

const pgClient = new Pool({
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
    host: keys.pgHost,
    port: "5432"
});

/*
const pgClient = new Pool({
    user: "myappuser",
    password: "1qaz2wsx",
    database: "myappdb",
    host: "mypostgres",
    port: "5432"
});
*/

pgClient.on('error', () => {
    console.log("Postgres not connected");
});

pgClient.on('connect', () =>{
    console.log("Connected to Postgres server");
});

pgClient.query('CREATE TABLE IF NOT EXISTS dywidenda (id SERIAL PRIMARY KEY, wartosc NUMERIC(15, 2), rentownosc NUMERIC(4, 2))').catch(err => console.log(err));

// rest
const PORT = 5000;

function stringifyTax(id, wartosc, rentownosc)
{
    return "Id: "+ id + ", Wartość: " + wartosc + "zł, Rentowność: " + rentownosc + "%, Podatek: " + (wartosc*rentownosc*0.01*0.19).toFixed(2)+"zł\n";
}

function stringifyTaxes(rows)
{
    var str = "";

    for (i = 0; i < rows.length; i++)
    {
        str += stringifyTax(rows[i].id, rows[i].wartosc, rows[i].rentownosc);
    }

    return str;
}

app.get("/api", (req, res) => {

    var id = req.query['id'];

    if (!id)
    {
        pgClient.
        query('SELECT * FROM dywidenda;').
        then(result => {res.send(stringifyTaxes(result.rows))}).
        catch((err) => {console.log(err)});
    }
    else
    {
        redisClient.get(id, (err, result) => {
            if (result == null)
            {
                pgClient.
                query('SELECT * FROM dywidenda WHERE id=' + id + ';').
                then(result => {res.send(stringifyTaxes(result.rows))}).
                catch((err) => {console.log(err)});
            }
            else
            {
                res.send(stringifyTax(id, JSON.parse(result)["wartosc"], JSON.parse(result)["rentownosc"]));
            }
        });
    }
});

app.post('/api', (req, res) => {
    var wartosc = req.body['wartosc'];
    var rentownosc = req.body['rentownosc'];

    pgClient.
    query('INSERT INTO dywidenda (wartosc, rentownosc) VALUES (' + wartosc + ',' + rentownosc + ') RETURNING id;').
    then(result => {redisClient.set(result.rows[0].id, JSON.stringify({wartosc : wartosc, rentownosc: rentownosc}))}).
    catch((err) => {console.log(err)});

    pgClient.
    query('SELECT * FROM dywidenda;').
    then(result => {res.send(stringifyTaxes(result.rows))}).
    catch((err) => {res.send(err)});
});

app.put('/api', (req, res) => {
    var id = req.body['id'];
    var wartosc = req.body['wartosc'];
    var rentownosc = req.body['rentownosc'];

    pgClient.
    query("UPDATE dywidenda SET wartosc = "+ wartosc + ", rentownosc = " + rentownosc +" WHERE id = " + id +";").
    then(redisClient.set(id, JSON.stringify({wartosc : wartosc, rentownosc: rentownosc}))).
    catch((err) => {console.log(err)});

    res.send("");
});

app.delete('/api', (req, res) => {
    var id = req.query['id'];

    pgClient.
    query("DELETE FROM dywidenda WHERE id = " + id +";").
    then(redisClient.del(id)).
    catch((err) => {console.log(err)});

    res.send("");
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})


/*
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
*/