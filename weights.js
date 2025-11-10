// Elements
const tableContainer = document.getElementById("tableContainer");
const weightsContainer = document.getElementById("weightsContainer");
const assistantBtn = document.getElementById("assistantBtn");
const nextBtn = document.getElementById("nextBtn");

// Load previous table from localStorage
const criteria = JSON.parse(localStorage.getItem("criteria"));
const alternatives = JSON.parse(localStorage.getItem("alternatives"));
const tableValues = JSON.parse(localStorage.getItem("tableValues"));

// ------------------- Build Main Table -------------------
function buildTable() {
  tableContainer.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  // Header row
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th")); // top-left empty
  criteria.forEach(c => {
    const th = document.createElement("th");
    th.textContent = c;
    th.style.border = "1px solid #e5e7eb";
    th.style.padding = "6px";
    th.style.backgroundColor = "#6366f1";
    th.style.color = "white";
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Alternative rows (data)
  alternatives.forEach((alt, rIdx) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = alt;
    row.appendChild(th);

    criteria.forEach((c, cIdx) => {
      const td = document.createElement("td");
      td.style.border = "1px solid #e5e7eb";
      td.style.padding = "6px";

      const input = document.createElement("input");
      input.type = "number";
      input.value = tableValues[rIdx][cIdx];
      input.id = `cell-${rIdx}-${cIdx}`;
      input.style.width = "60px";
      input.style.textAlign = "center";

      td.appendChild(input);
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

// ------------------- Build Weights Table -------------------
function buildWeightsTable() {
  weightsContainer.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  const row = document.createElement("tr");

  criteria.forEach((c, i) => {
    const td = document.createElement("td");
    td.style.border = "1px solid #e5e7eb";
    td.style.padding = "6px";
    td.style.textAlign = "center";

    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.step = 0.01;
    input.value = 1; // default weight
    input.id = `weight-${i}`;
    input.classList.add("weightInput");
    input.style.width = "60px";
    input.style.textAlign = "center";

    td.appendChild(input);
    row.appendChild(td);
  });

  table.appendChild(row);
  weightsContainer.appendChild(table);
}

// ------------------- Initialize Page -------------------
buildTable();
buildWeightsTable();

// ------------------- Buttons -------------------
assistantBtn.addEventListener("click", () => {
  alert("Assistant Weight Entry is not implemented yet.");
});

nextBtn.addEventListener("click", () => {
    // Read weights from weights table
    const weights = criteria.map((c, i) => parseFloat(document.getElementById(`weight-${i}`).value) || 0);
  
    // Calculate sum
    const sumWeights = weights.reduce((a, b) => a + b, 0);
  
    // Check if sum is 1 (allowing small floating point tolerance)
    if (Math.abs(sumWeights - 1) > 0.0001) {
      alert("The sum of weights must be 1. Please adjust them.");
      return; // stop here, do not proceed
    }
  
    // Save weights to localStorage
    localStorage.setItem("weights", JSON.stringify(weights));
  
    // Save table values in case user edited them
    const updatedTable = alternatives.map((alt, r) =>
      criteria.map((c, cIdx) => parseFloat(document.getElementById(`cell-${r}-${cIdx}`).value) || 0)
    );
    localStorage.setItem("tableValues", JSON.stringify(updatedTable));
  
    // Navigate to calculations page
    window.location.href = "calculate.html";
  });
  
