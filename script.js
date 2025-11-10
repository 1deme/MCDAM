// Elements
const numCriteriaInput = document.getElementById("numCriteria");
const numAlternativesInput = document.getElementById("numAlternatives");
const tableContainer = document.getElementById("tableContainer");
const nextBtn = document.getElementById("nextBtn");

let criteria = [];
let alternatives = [];

// Create or update table
function buildTable() {
  const numCriteria = parseInt(numCriteriaInput.value);
  const numAlternatives = parseInt(numAlternativesInput.value);

  // Initialize names if not set
  if(criteria.length !== numCriteria) criteria = Array.from({length:numCriteria}, (_,i)=>`Criterion ${i+1}`);
  if(alternatives.length !== numAlternatives) alternatives = Array.from({length:numAlternatives}, (_,i)=>`Alternative ${i+1}`);

  tableContainer.innerHTML = ""; // Clear previous table

  const table = document.createElement("table");

  // Header row
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th")); // empty top-left cell
  criteria.forEach(c => {
    const th = document.createElement("th");
    th.textContent = c;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Rows for alternatives
  alternatives.forEach((alt, rIdx) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = alt;
    row.appendChild(th);

    criteria.forEach((c, cIdx) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.value = 0;
      input.id = `cell-${rIdx}-${cIdx}`;
      td.appendChild(input);
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

// Rebuild table when user changes numbers
numCriteriaInput.addEventListener("change", buildTable);
numAlternativesInput.addEventListener("change", buildTable);

// Initial build
buildTable();

// Next button: save table and go to weights page
nextBtn.addEventListener("click", () => {
  const numCriteria = parseInt(numCriteriaInput.value);
  const numAlternatives = parseInt(numAlternativesInput.value);

  // Save table values
  const tableValues = alternatives.map((alt, r) =>
    criteria.map((c, cIdx) => parseFloat(document.getElementById(`cell-${r}-${cIdx}`).value) || 0)
  );

  localStorage.setItem("criteria", JSON.stringify(criteria));
  localStorage.setItem("alternatives", JSON.stringify(alternatives));
  localStorage.setItem("tableValues", JSON.stringify(tableValues));

  // Navigate to general weights page
  window.location.href = "weights.html";
});
