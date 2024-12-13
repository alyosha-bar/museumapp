
// TODO
// Make Github Repo
// Integrate Clerk Auth
// Save to DB with the user ID
// Make more typescripty



// classic requires
require('dotenv').config();
const cors = require('cors');
const express = require('express');


const app = express();

// set up Pool
const { Pool } = require('pg')


// middleware
app.use(express.json())
// Enable CORS for all routes
app.use(cors());


// Create a new pool using the DATABASE_URL from the .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log(result.rows);  // Should log the current timestamp from the database
    });
});


app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
    }
});



app.post("/pin", async (req, res) => {
    console.log(req.body)

    // save the body to the database
    // name --> key
    // author --> author
    // address --> address
    // lat --> lat
    // lng --> lng
    try {
        // Insert pin
        const query = 'INSERT INTO pin (key, author, address, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [req.body.name, req.body.author, req.body.address, req.body.lat, req.body.lng];
        
        // Execute query
        const result = await pool.query(query, values);
        res.send(result.rows); // return the updated pin values
    } catch (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
    }
})


app.get("/pins", async (req, res) => {

    // const locations = [
    //     { key: 'bigBen', location: { lat: 51.5007292, lng: -0.1246254 } },
    //     { key: 'towerOfLondon', location: { lat: 51.5081124, lng: -0.0759493 } },
    //     { key: 'buckinghamPalace', location: { lat: 51.501364, lng: -0.14189 } },
    //     { key: 'londonEye', location: { lat: 51.5032973, lng: -0.1195537 } },
    //     { key: 'britishMuseum', location: { lat: 51.5194134, lng: -0.1269562 } },
    //     { key: 'trafalgarSquare', location: { lat: 51.508039, lng: -0.128069 } },
    //     { key: 'stPaulsCathedral', location: { lat: 51.5138453, lng: -0.0983515 } },
    //     { key: 'naturalHistoryMuseum', location: { lat: 51.496715, lng: -0.176367 } },
    //     { key: 'tateModern', location: { lat: 51.5075939, lng: -0.0993568 } },
    //     { key: 'hydePark', location: { lat: 51.5072682, lng: -0.1657303 } },
    //     { key: 'coventGarden', location: { lat: 51.511756, lng: -0.123041 } },
    //     { key: 'shard', location: { lat: 51.5045044, lng: -0.0865199 } },
    //     { key: 'oxfordStreet', location: { lat: 51.5144983, lng: -0.1465268 } },
    //     { key: 'camdenMarket', location: { lat: 51.5412885, lng: -0.1445944 } },
    //     { key: 'kewGardens', location: { lat: 51.4787433, lng: -0.2955083 } },
    // ];


    try {
        const query = "SELECT * FROM pin";
        const result = await pool.query(query)

        if (result.rows <= 0) {
            res.status(400).send("Invalid request.")
        }
        res.send(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).send("Error fetching from database.")
    }
})



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
