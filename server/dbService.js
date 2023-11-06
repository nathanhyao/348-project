const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService(); // Singleton
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM tasks;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewTask(taskDescription) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO tasks (description, date_added) VALUES (?, ?);";

        connection.query(query, [taskDescription, dateAdded], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(result.insertId);
        });
      });
      console.log(insertId);
      return {
        task_id: insertId,
        description: taskDescription,
        date_added: dateAdded
      };
    } catch (error) {
      console.log(error)
    }
  }

  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM tasks WHERE task_id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(result.affectedRows);
        });
      });
      // console.log(response);
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = DbService;