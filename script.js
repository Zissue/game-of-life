const container = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const clearButton = document.getElementById("clear-button");

const rows = 50;
const cols = 50;
const speed = 100; // in milliseconds

let grid = createGrid(rows, cols);
let interval;

function createGrid(rows, cols) {
    const grid = new Array(rows).fill(null).map(() => new Array(cols).fill(false));

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.addEventListener("click", () => toggleCell(row, col));
            container.appendChild(cell);
        }
    }

    return grid;
}

function toggleCell(row, col) {
    grid[row][col] = !grid[row][col];
    updateCell(row, col);
}

function updateCell(row, col) {
    const cell = container.children[row * cols + col];
    cell.classList.toggle("alive", grid[row][col]);
}

function nextGeneration() {
    const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
            const neighbors = getAliveNeighbors(rowIndex, colIndex);
            const isAlive = cell;

            if (isAlive && (neighbors === 2 || neighbors === 3)) {
                return true;
            } else if (!isAlive && neighbors === 3) {
                return true;
            } else {
                return false;
            }
        })
    );

    // Update only the changed cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] !== newGrid[row][col]) {
                grid[row][col] = newGrid[row][col];
                updateCell(row, col);
            }
        }
    }
}

function getAliveNeighbors(row, col) {
    let count = 0;

    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue;

            const newRow = row + r;
            const newCol = col + c;

            if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                grid[newRow][newCol]
            ) {
                count++;
            }
        }
    }

    return count;
}

function startGame() {
    interval = setInterval(nextGeneration, speed);
}

function pauseGame() {
    clearInterval(interval);
}

function clearGame() {
    pauseGame();
    grid = createGrid(rows, cols);
}

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
clearButton.addEventListener("click", clearGame);
