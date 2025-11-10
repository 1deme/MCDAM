function showTable(criteria, alternatives, container) {
    container.innerHTML = "";
  
    const title = document.createElement("h2");
    title.textContent = "Decision Table";
    container.appendChild(title);
  
    const table = document.createElement("table");
    table.className = "data-table";
  
    // Header row
    const headerRow = document.createElement("tr");
    const emptyCell = document.createElement("th");
    headerRow.appendChild(emptyCell);
    criteria.forEach((c) => {
      const th = document.createElement("th");
      th.textContent = c;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    // Rows for alternatives
    alternatives.forEach((alt) => {
      const row = document.createElement("tr");
  
      // first column = alternative name
      const altCell = document.createElement("th");
      altCell.textContent = alt;
      row.appendChild(altCell);
  
      // rest = editable numeric inputs
      criteria.forEach(() => {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.className = "value-input";
        input.placeholder = "0";
        cell.appendChild(input);
        row.appendChild(cell);
      });
  
      table.appendChild(row);
    });
  
    container.appendChild(table);
    container.classList.remove("hidden");
  }
  