const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService')

app.use(cors()); // Don't block incoming API calls
app.use(express.json()); // Send in JSON format
app.use(express.urlencoded({ extended: false }));

// create
app.post('/insert', (request, response) => {

});

// read
app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then()
    .catch()
});

// update


// delete



app.listen(process.env.PORT, () => console.log('app is running'));