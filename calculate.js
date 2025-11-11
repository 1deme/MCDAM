// Elements
const tableContainer = document.getElementById("tableContainer");
const resultsDiv = document.getElementById("results");
const simpleBtn = document.getElementById("simpleBtn");
const topsisBtn = document.getElementById("topsisBtn");

// Load data from previous page
const criteria = JSON.parse(localStorage.getItem("criteria"));
const alternatives = JSON.parse(localStorage.getItem("alternatives"));
const tableValues = JSON.parse(localStorage.getItem("tableValues"));
const weights = JSON.parse(localStorage.getItem("weights")) || [];

// ------------------- Build Criterion Type Selectors -------------------
function buildCriterionTypeSelectors() {
  const container = document.getElementById("criterionTypesContainer");
  container.innerHTML = "";

  criteria.forEach((c, i) => {
    const div = document.createElement("div");
    div.style.marginBottom = "5px";

    const label = document.createElement("label");
    label.textContent = `${c}: `;

    const select = document.createElement("select");
    select.id = `crit-type-${i}`;

    const benefitOption = document.createElement("option");
    benefitOption.value = "benefit";
    benefitOption.textContent = "Benefit";

    const costOption = document.createElement("option");
    costOption.value = "cost";
    costOption.textContent = "Cost";

    select.appendChild(benefitOption);
    select.appendChild(costOption);

    div.appendChild(label);
    div.appendChild(select);
    container.appendChild(div);
  });
}

// ------------------- Build Table -------------------
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

  // Alternative rows
  alternatives.forEach((alt, rIdx) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = alt;
    row.appendChild(th);

    criteria.forEach((c, cIdx) => {
      const td = document.createElement("td");
      td.style.border = "1px solid #e5e7eb";
      td.style.padding = "6px";
      td.style.textAlign = "center";
      td.textContent = tableValues[rIdx][cIdx];
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  // Weight row at bottom
  const weightRow = document.createElement("tr");
  const th = document.createElement("th");
  th.textContent = "Weight";
  weightRow.appendChild(th);

  weights.forEach(w => {
    const td = document.createElement("td");
    td.style.border = "1px solid #e5e7eb";
    td.style.padding = "6px";
    td.style.textAlign = "center";
    td.textContent = w;
    weightRow.appendChild(td);
  });

  table.appendChild(weightRow);
  tableContainer.appendChild(table);
}

// ------------------- SAW Calculation -------------------
function calculateSAW() {
  const normalized = [];
  const criterionTypes = criteria.map((c, i) =>
    document.getElementById(`crit-type-${i}`).value
  );

  for (let cIdx = 0; cIdx < criteria.length; cIdx++) {
    const col = tableValues.map(row => row[cIdx]);
    const max = Math.max(...col);
    const min = Math.min(...col);

    col.forEach((val, rIdx) => {
      if (!normalized[rIdx]) normalized[rIdx] = [];
      if (criterionTypes[cIdx] === "benefit") {
        normalized[rIdx][cIdx] = val / max;
      } else { // cost
        normalized[rIdx][cIdx] = min / val;
      }
    });
  }

  const scores = normalized.map((row, rIdx) =>
    row.reduce((sum, val, cIdx) => sum + val * weights[cIdx], 0)
  );

  // Display results
  resultsDiv.innerHTML = "<h3>SAW Scores</h3>";
  const ul = document.createElement("ul");
  const maxScore = Math.max(...scores);
  scores.forEach((score, rIdx) => {
    const li = document.createElement("li");
    li.textContent = `${alternatives[rIdx]}: ${score.toFixed(3)}`;
    if (score === maxScore) li.style.color = "green";
    ul.appendChild(li);
  });
  resultsDiv.appendChild(ul);
}

// ------------------- TOPSIS Calculation -------------------
function calculateTOPSIS() {
  // Step 1: Normalize matrix (vector normalization)
  const normalized = [];
  for (let cIdx = 0; cIdx < criteria.length; cIdx++) {
    const col = tableValues.map(row => row[cIdx]);
    const denominator = Math.sqrt(col.reduce((sum, val) => sum + val * val, 0));
    col.forEach((val, rIdx) => {
      if (!normalized[rIdx]) normalized[rIdx] = [];
      normalized[rIdx][cIdx] = val / denominator;
    });
  }

  // Step 2: Weighted normalized matrix
  const weighted = normalized.map(row =>
    row.map((val, cIdx) => val * weights[cIdx])
  );

  // Step 3: Determine positive and negative ideal (all benefit)
  const idealPositive = [];
  const idealNegative = [];
  for (let cIdx = 0; cIdx < criteria.length; cIdx++) {
    const col = weighted.map(row => row[cIdx]);
    idealPositive[cIdx] = Math.max(...col);
    idealNegative[cIdx] = Math.min(...col);
  }

  // Step 4: Calculate distances to ideals
  const dPositive = weighted.map(row =>
    Math.sqrt(row.reduce((sum, val, cIdx) => sum + Math.pow(val - idealPositive[cIdx], 2), 0))
  );
  const dNegative = weighted.map(row =>
    Math.sqrt(row.reduce((sum, val, cIdx) => sum + Math.pow(val - idealNegative[cIdx], 2), 0))
  );

  // Step 5: Calculate final scores (closeness coefficient)
  const scores = dNegative.map((dNeg, i) => dNeg / (dNeg + dPositive[i]));

  // Display results
  resultsDiv.innerHTML = "<h3>TOPSIS Scores</h3>";
  const ul = document.createElement("ul");
  const maxScore = Math.max(...scores);
  scores.forEach((score, rIdx) => {
    const li = document.createElement("li");
    li.textContent = `${alternatives[rIdx]}: ${score.toFixed(3)}`;
    if (score === maxScore) li.style.color = "green";
    ul.appendChild(li);
  });
  resultsDiv.appendChild(ul);
}

// ------------------- Buttons -------------------
simpleBtn.addEventListener("click", calculateSAW);
topsisBtn.addEventListener("click", calculateTOPSIS);

// ------------------- Initialize -------------------
buildCriterionTypeSelectors();
buildTable();
