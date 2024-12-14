
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


        // Get more results
        const select = 'SELECT * FROM pin'
        const pins = await pool.query(select)
        res.send(pins.rows); // return the updated pin values
    } catch (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
    }
})


app.get("/pins", async (req, res) => {

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
