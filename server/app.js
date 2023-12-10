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
  const { taskDescription } = request.body;
  // console.log(taskDescription);
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewTask(taskDescription);

  result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// read
app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// update
app.patch('/update', (request, response) => {
  console.log(`update/ request.body is ${request.body}`);
  const { id, task } = request.body;
  const db = dbService.getDbServiceInstance();

  console.log("Updating task with id " + id);
  const result = db.updateTaskById(task, id);

  result
    .then(data => response.json({ success: data }))
    .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) => {
  console.log(`delete/ request.params is ${request.params}`);
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  console.log("Deleting task with id " + id);
  const result = db.deleteRowById(id);

  result
    .then(data => response.json({ success: data }))
    .catch(err => console.log(err));
})


app.listen(process.env.PORT, () => console.log('app is running'));