// Elements
const tableContainer = document.getElementById("tableContainer");
const weightsContainer = document.getElementById("weightsContainer");
const assistantBtn = document.getElementById("assistantBtn");
const nextBtn = document.getElementById("nextBtn");

// AHP modal elements
const ahpModal = document.getElementById("ahpModal");
const pairwiseTable = document.getElementById("pairwiseTable");
const ahpResults = document.getElementById("ahpResults");
const calcAHPBtn = document.getElementById("calcAHPBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// Load previous data
const criteria = JSON.parse(localStorage.getItem("criteria"));
const alternatives = JSON.parse(localStorage.getItem("alternatives"));
const tableValues = JSON.parse(localStorage.getItem("tableValues"));

// ------------------- Build Main Table -------------------
function buildTable() {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));
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
      input.style.width = "60px";
      input.style.textAlign = "center";
      td.appendChild(input);
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

// ------------------- Build Weights Table -------------------
function buildWeightsTable() {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  const row = document.createElement("tr");
  criteria.forEach((c, i) => {
    const td = document.createElement("td");
    td.style.border = "1px solid #e5e7eb";
    td.style.padding = "6px";
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.step = 0.01;
    input.value = 1;
    input.className = "weightInput";
    input.style.width = "60px";
    input.style.textAlign = "center";
    td.appendChild(input);
    row.appendChild(td);
  });
  table.appendChild(row);
  weightsContainer.innerHTML = "";
  weightsContainer.appendChild(table);
}

// ------------------- AHP Modal Logic -------------------
assistantBtn.addEventListener("click", () => {
  buildPairwiseTable();
  ahpModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  ahpModal.style.display = "none";
});

function buildPairwiseTable() {
  const n = criteria.length;
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));
  criteria.forEach(c => {
    const th = document.createElement("th");
    th.textContent = c;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  for (let i = 0; i < n; i++) {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = criteria[i];
    row.appendChild(th);

    for (let j = 0; j < n; j++) {
      const td = document.createElement("td");
      if (i === j) {
        td.textContent = "1";
      } else if (i < j) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0.111";
        input.max = "9";
        input.step = "0.111";
        input.value = "1";
        input.style.width = "60px";
        input.id = `pair-${i}-${j}`;
        td.appendChild(input);
      } else {
        td.id = `auto-${i}-${j}`;
      }
      row.appendChild(td);
    }
    table.appendChild(row);
  }

  pairwiseTable.innerHTML = "";
  pairwiseTable.appendChild(table);
}

// ------------------- AHP Calculation -------------------
calcAHPBtn.addEventListener("click", () => {
  const n = criteria.length;
  const A = Array.from({ length: n }, () => Array(n).fill(1));

  // Fill upper triangle and compute reciprocals
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const val = parseFloat(document.getElementById(`pair-${i}-${j}`).value);
      A[i][j] = val;
      A[j][i] = 1 / val;
    }
  }

  // Normalize columns
  const colSums = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) colSums[j] += A[i][j];
  }

  const norm = A.map(row => row.map((val, j) => val / colSums[j]));

  // Calculate weights
  const weights = norm.map(row => row.reduce((a, b) => a + b, 0) / n);

  // Consistency check
  const Aw = A.map(row => row.reduce((sum, val, j) => sum + val * weights[j], 0));
  const lambdaMax = Aw.reduce((sum, val, i) => sum + val / weights[i], 0) / n;
  const CI = (lambdaMax - n) / (n - 1);
  const RI = [0, 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45][n] || 1.49;
  const CR = CI / RI;

  // Display results
  ahpResults.innerHTML = `
    <p><b>Weights:</b> ${weights.map(w => w.toFixed(3)).join(", ")}</p>
    <p><b>λmax:</b> ${lambdaMax.toFixed(3)}, <b>CI:</b> ${CI.toFixed(3)}, <b>CR:</b> ${CR.toFixed(3)}</p>
    ${CR > 0.1 ? "<p style='color:red'>⚠️ Inconsistent judgments (CR > 0.1)</p>" : "<p style='color:green'>✅ Consistent judgments</p>"}
  `;

  // Fill weight inputs
  document.querySelectorAll(".weightInput").forEach((input, i) => {
    input.value = weights[i].toFixed(3);
  });

  // Save to localStorage
  localStorage.setItem("weights", JSON.stringify(weights));
});

// ------------------- Next Button -------------------
nextBtn.addEventListener("click", () => {
  const weights = Array.from(document.querySelectorAll(".weightInput")).map(i => parseFloat(i.value) || 0);
  const sum = weights.reduce((a, b) => a + b, 0);

  if (Math.abs(sum - 1) > 0.001) {
    alert("Sum of weights must be 1. Please recalculate or normalize.");
    return;
  }

  localStorage.setItem("weights", JSON.stringify(weights));
  window.location.href = "calculate.html";
});

// Init
buildTable();
buildWeightsTable();
