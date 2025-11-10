// ------------------- Elements -------------------
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const tableView = document.getElementById("tableView");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const generateBtn = document.getElementById("generateBtn");

const numCriteriaInput = document.getElementById("numCriteria");
const numAlternativesInput = document.getElementById("numAlternatives");

const criteriaContainer = document.getElementById("criteriaNames");
const alternativesContainer = document.getElementById("alternativeNames");

// ------------------- Variables -------------------
let criteria = [];
let alternatives = [];

// ------------------- Step 1 → Step 2 -------------------
nextBtn.addEventListener("click", () => {
  const numCriteria = parseInt(numCriteriaInput.value);
  const numAlternatives = parseInt(numAlternativesInput.value);

  criteriaContainer.innerHTML = "";
  alternativesContainer.innerHTML = "";

  for (let i = 1; i <= numCriteria; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = `Criterion ${i}`;
    criteriaContainer.appendChild(input);
  }

  for (let i = 1; i <= numAlternatives; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = `Alternative ${i}`;
    alternativesContainer.appendChild(input);
  }

  step1.classList.add("hidden");
  step2.classList.remove("hidden");
});

// ------------------- Step 2 → Step 1 -------------------
backBtn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step1.classList.remove("hidden");
});

// ------------------- Generate Table -------------------
generateBtn.addEventListener("click", () => {
  criteria = Array.from(criteriaContainer.querySelectorAll("input")).map(i => i.value);
  alternatives = Array.from(alternativesContainer.querySelectorAll("input")).map(i => i.value);

  step2.classList.add("hidden");
  showTable(criteria, alternatives, tableView);
});

// ------------------- Show Table Function -------------------
function showTable(criteria, alternatives, container) {
  container.innerHTML = ""; // Clear previous content

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  // Header row
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th")); // empty top-left cell
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
  alternatives.forEach((alt, r) => {
    const row = document.createElement("tr");

    const th = document.createElement("th");
    th.textContent = alt;
    th.style.border = "1px solid #e5e7eb";
    th.style.padding = "6px";
    row.appendChild(th);

    criteria.forEach((c, cIdx) => {
      const td = document.createElement("td");
      td.style.border = "1px solid #e5e7eb";
      td.style.padding = "6px";

      const input = document.createElement("input");
      input.type = "number";
      input.value = 0;
      input.id = `cell-${r}-${cIdx}`;
      input.style.width = "60px";
      input.style.textAlign = "center";

      td.appendChild(input);
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  container.appendChild(table);

  // Add SAW and Other buttons below table
  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.marginTop = "12px";

  const sawBtn = document.createElement("button");
  sawBtn.textContent = "SAW Method";
  sawBtn.style.marginRight = "10px";

  const otherBtn = document.createElement("button");
  otherBtn.textContent = "Other Methods";

  buttonsDiv.appendChild(sawBtn);
  buttonsDiv.appendChild(otherBtn);
  container.appendChild(buttonsDiv);

  // ------------------- Button Listeners -------------------
  sawBtn.addEventListener("click", () => {
    const tableValues = alternatives.map((alt, r) =>
      criteria.map((c, cIdx) =>
        parseFloat(document.getElementById(`cell-${r}-${cIdx}`).value) || 0
      )
    );
    localStorage.setItem("criteria", JSON.stringify(criteria));
    localStorage.setItem("alternatives", JSON.stringify(alternatives));
    localStorage.setItem("tableValues", JSON.stringify(tableValues));
    window.location.href = "saw.html";
  });

  otherBtn.addEventListener("click", () => {
    const tableValues = alternatives.map((alt, r) =>
      criteria.map((c, cIdx) =>
        parseFloat(document.getElementById(`cell-${r}-${cIdx}`).value) || 0
      )
    );
    localStorage.setItem("criteria", JSON.stringify(criteria));
    localStorage.setItem("alternatives", JSON.stringify(alternatives));
    localStorage.setItem("tableValues", JSON.stringify(tableValues));
    window.location.href = "other.html";
  });
}
