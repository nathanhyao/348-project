document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

// Must dynamically listen for delete button on click (may not exist)
document.querySelector('table tbody').addEventListener('click', function (event) {
  console.log(event.target);
  if (event.target.className === "delete-row-btn") {
    deleteRowById(event.target.getAttribute("task-id"));
  }
});

function deleteRowById(id) {
  fetch('http://localhost:5000/delete/' + id, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => console.log(data));
}

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

function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Tasks</td></tr>";
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