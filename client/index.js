document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => console.log(data))

  loadHTMLTable([]);
});

function loadHTMLTable(tasks) {
  const table = document.querySelector('table tbody')

  if (tasks.length == 0) {
    table.innerHTML = "<tr><td class='no-tasks' colspan='5'>No Tasks</td></tr>"
  }
}