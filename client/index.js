document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function (event) {

  /* Must dynamically listen for delete button on click. */
  console.log(`click event.target is ${event.target}`);
  if (event.target.className === "delete-row-btn") {
    deleteRowById(event.target.getAttribute("task-id"));
  }
  if (event.target.className === "edit-row-btn") {
    handleEditRow(event.target.getAttribute("task-id"));
  }
});

/* Search/filter functionality */

const searchBtn = document.querySelector("#search-btn");
const viewAllBtn = document.querySelector("#view-all-btn");

searchBtn.onclick = function () {
  const keyword = document.querySelector("#search-input").value;

  fetch("http://localhost:5000/search/" + keyword)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

viewAllBtn.addEventListener("click", (e) => {
  location.reload();
});

/* Edit/update task functionality */

function handleEditRow(id) {
  const updateSection = document.querySelector("#update-section");
  updateSection.hidden = false;
  document.querySelector('#update-row-btn').dataset.id = id;
  document.querySelector('#update-task-input').placeholder = `update task with id ${id}`;
}

const updateBtn = document.querySelector("#update-row-btn");

updateBtn.onclick = function () {
  const updatedTaskInput = document.querySelector('#update-task-input');
  // console.log(`updatedTaskInput.dataset.id: ${updatedTaskInput.dataset.id}`);

  fetch('http://localhost:5000/update', {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: updateBtn.dataset.id,
      task: updatedTaskInput.value
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(`update task got data: ${data}`);
      if (data.success) {
        location.reload();
      }
    });
}

/* Delete task functionality */

function deleteRowById(id) {
  fetch('http://localhost:5000/delete/' + id, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log(`deleteRowById data: ${data}`);
      if (data.success) {
        location.reload();
      }
    });
}

/* Add task functionality */

const addBtn = document.querySelector('#add-task-btn');

addBtn.onclick = function () {
  const taskInput = document.querySelector('#task-input');
  const taskDescription = taskInput.value;
  taskInput.value = "";

  fetch('http://localhost:5000/insert', {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ taskDescription: taskDescription })
  })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
  console.log(data)
  const table = document.querySelector('table tbody');
  const isTableData = table.querySelector('.no-data');

  tableHTML = "<tr>";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'date_added') {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHTML += `<td>${data[key]}</td>`;
    }
  }
  console.log(tableHTML)
  tableHTML += `<td><button class="delete-row-btn" task-id=${data.task_id}>Delete</td>`;
  tableHTML += `<td><button class="edit-row-btn" task-id=${data.task_id}>Edit</td>`;
  tableHTML += "</tr>";

  if (isTableData) {
    table.innerHTML = tableHTML;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHTML;
  }
}

/* Delete by keyword functionality (STORED PROCEDURES) */

deleteByKeywordBtn = document.querySelector('#delete-keyword-btn');
deleteAllBtn = document.querySelector('#delete-all-btn');

deleteByKeywordBtn.onclick = function () {
  const keyword = document.querySelector("#delete-input").value;

  fetch('http://localhost:5000/delete/keyword/' + keyword, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log(`deleteByKeyword data: ${data}`);
      if (data.success) {
        location.reload();
      }
    });
}

deleteAllBtn.onclick = function () {
  fetch('http://localhost:5000/deleteAll', {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log(`deleteAll data: ${data}`);
      if (data.success) {
        location.reload();
      }
    });
}

/* Load initial page */

function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Tasks Found!</td></tr>";
    return;
  }

  console.log(data);

  let tableHTML = "";
  data.forEach(function ({ task_id, description, date_added }) {
    // Parameter names must match names returned from database
    tableHTML += "<tr>";
    tableHTML += `<td>${task_id}</td>`;
    tableHTML += `<td>${description}</td>`;
    tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`;
    tableHTML += `<td><button class="delete-row-btn" task-id=${task_id}>Delete</td>`;
    tableHTML += `<td><button class="edit-row-btn" task-id=${task_id}>Edit</td>`;
    tableHTML += "</tr>";
  });

  table.innerHTML = tableHTML;
}