const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30; // Размер блока
let score = 0;

// Сетку для игры
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Массив возможных форм тетромино
const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 0], [1, 1, 1]], // T
];

// Рандомно выбираем тетромино
function randomTetromino() {
    const randIndex = Math.floor(Math.random() * tetrominoes.length);
    return tetrominoes[randIndex];
}

let currentTetromino = randomTetromino();
let currentX = COLS / 2 - 2;
let currentY = 0;

function drawTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = "red";
                ctx.fillRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

// Рисуем игровую сетку
function drawGrid() {
    ctx.fillStyle = "#000";
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = "blue";
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

// Проверка, можно ли переместить тетромино
function isValidMove(x, y, tetromino) {
    return tetromino.every((row, dy) => 
        row.every((cell, dx) => {
            const newX = x + dx;
            const newY = y + dy;
            return (
                !cell ||
                (newX >= 0 && newX < COLS && newY < ROWS && !grid[newY][newX])
            );
        })
    );
}

// Обработчик нажатий клавиш
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        if (isValidMove(currentX - 1, currentY, currentTetromino)) {
            currentX--;
        }
    } else if (event.key === "ArrowRight") {
        if (isValidMove(currentX + 1, currentY, currentTetromino)) {
            currentX++;
        }
    } else if (event.key === "ArrowDown") {
        if (isValidMove(currentX, currentY + 1, currentTetromino)) {
            currentY++;
        }
    } else if (event.key === "ArrowUp") {
        // Поворот тетромино
        const rotated = currentTetromino[0].map((_, index) =>
            currentTetromino.map(row => row[index])
        );
        if (isValidMove(currentX, currentY, rotated)) {
            currentTetromino = rotated;
        }
    }
});

// Проверка на линии
function checkLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell)) {
            score += 100;
            grid.splice(y, 1);
            grid.unshift(Array(COLS).fill(0));
        }
    }
}

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawTetromino();

    // Если тетромино не может двигаться вниз, фиксируем его на месте
    if (!isValidMove(currentX, currentY + 1, currentTetromino)) {
        currentTetromino.forEach((row, y) => 
            row.forEach((cell, x) => {
                if (cell) grid[currentY + y][currentX + x] = 1;
            })
        );
        checkLines();
        currentTetromino = randomTetromino();
        currentX = COLS / 2 - 2;
        currentY = 0;
    } else {
        currentY++;
    }

    document.getElementById("score").innerText = "Счёт: " + score;

    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();
