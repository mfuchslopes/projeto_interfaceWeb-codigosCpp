const grid = document.getElementById("grid");
let activeCell = null;

const darkPattern = [
    [false, true, false, true, false],
    [true, false, true, false, true],
    [false, true, false, true, false],
    [true, false, true, false, true],
    [false, true, false, true, false],
];

for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
        const cell = document.createElement("div");

        cell.classList.add("cell", `col-${col + 1}`);

        cell.dataset.row = row;
        cell.dataset.col = col;

        if (darkPattern[row][col]) {
            cell.classList.add("dark");
        }

        cell.addEventListener("click", async () => {
            const r = Number(cell.dataset.row);
            const c = Number(cell.dataset.col);

            if (activeCell === cell) {
                cell.classList.remove("active");
                cell.textContent = "";
                activeCell = null;
                return;
            }

            if (activeCell) {
                activeCell.classList.remove("active");
                activeCell.textContent = "";
            }

            cell.classList.add("active");
            activeCell = cell;

            const resposta = await enviarDados(r, c);
            cell.textContent = resposta.valor;
        });

        grid.appendChild(cell);
    }
}

const button = document.getElementById("randomBtn");

button.addEventListener("click", async () => {
    const cells = document.querySelectorAll(".cell");
    const index = Math.floor(Math.random() * cells.length);
    const cell = cells[index];

    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    if (activeCell) {
        activeCell.classList.remove("active");
        activeCell.textContent = "";
    }

    cell.classList.add("active");
    activeCell = cell;

    const resposta = await enviarDados(r, c);
    cell.textContent = resposta.valor;
});

async function enviarDados(row, col) {
    const resposta = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ row, col })
    });
    return resposta.json();
}