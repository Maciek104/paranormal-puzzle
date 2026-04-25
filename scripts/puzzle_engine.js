const SIZE = 4;
const pieceSize = 100;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("puzzle");

let selectedImage = null;
let draggedPiece = null;

document.querySelectorAll(".polaroid").forEach(pol => {
    pol.addEventListener("click", () => {
        document.querySelectorAll(".polaroid").forEach(p => p.classList.remove("selected"));
        pol.classList.add("selected");

        selectedImage = pol.dataset.img;
        loadImage(selectedImage);
    });
});

function loadImage(path) {
    const img = new Image();
    img.src = path;

    img.onload = () => sliceImage(img);
}

function sliceImage(img) {
    const pieces = [];

    const minSide = Math.min(img.width, img.height);
    const sx = (img.width - minSide) / 2;
    const sy = (img.height - minSide) / 2;

    const sourcePieceSize = minSide / SIZE;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = pieceSize;
            canvas.height = pieceSize;

            ctx.drawImage(
                img,
                sx + x * sourcePieceSize,
                sy + y * sourcePieceSize,
                sourcePieceSize,
                sourcePieceSize,
                0,
                0,
                pieceSize,
                pieceSize
            );

            const piece = document.createElement("img");
            piece.src = canvas.toDataURL();
            piece.classList.add("piece");
            piece.draggable = true;

            piece.dataset.correctIndex = y * SIZE + x;

            piece.addEventListener("dragstart", dragStart);

            piece.addEventListener("click", () => {
                piecesContainer.appendChild(piece);
                checkWin();
            });

            pieces.push(piece);
        }
    }

    renderPuzzle(pieces);
}

piecesContainer.addEventListener("dragover", dragOver);
piecesContainer.addEventListener("drop", dropToPool);

function renderPuzzle(pieces) {
    piecesContainer.innerHTML = "";
    board.innerHTML = "";

    pieces.sort(() => Math.random() - 0.5);

    pieces.forEach(piece => {
        piecesContainer.appendChild(piece);
    });

    for (let i = 0; i < SIZE * SIZE; i++) {
        const slot = document.createElement("div");
        slot.classList.add("slot");
        slot.dataset.index = i;

        slot.addEventListener("dragover", dragOver);
        slot.addEventListener("drop", dropPiece);

        board.appendChild(slot);
    }
}

function dragStart(e) {
    startTimer();
    draggedPiece = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function dropPiece(e) {
    e.preventDefault();

    if (!draggedPiece) return;

    const slot = e.target.closest(".slot");
    if (!slot) return;

    const existingPiece = slot.querySelector(".piece");

    if (existingPiece && existingPiece !== draggedPiece) {
        piecesContainer.appendChild(existingPiece);
    }

    slot.appendChild(draggedPiece);

    setTimeout(checkWin, 200);
}

function dropToPool(e) {
    e.preventDefault();

    if (!draggedPiece) return;

    piecesContainer.appendChild(draggedPiece);

    setTimeout(checkWin, 200);
}

let timerStarted = false;
let startTime = null;
let timerInterval = null;
let elapsedTime = 0;

const timerDisplay = document.getElementById("timer");

function startTimer() {
    if (timerStarted) return;

    timerStarted = true;
    startTime = Date.now();

    timerInterval = setInterval(() => {
        const now = Date.now();
        elapsedTime = Math.floor((now - startTime) / 1000);

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        timerDisplay.textContent =
            `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 500);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetGame() {
    timerStarted = false;
    startTime = null;
    elapsedTime = 0;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = "0:00";

    board.innerHTML = "";
    piecesContainer.innerHTML = "";

    draggedPiece = null;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function showWinMessage(time) {
    const background = document.getElementById("win-background");
    const box = document.getElementById("win-message");
    const text = document.getElementById("win-text");

    text.textContent = `Brawo! Układanka ukończona w czasie ${time}`;
    background.classList.remove("hidden");
}

function hideWinMessage() {
    const box = document.querySelector("#win-background")
    
    box.classList.add("hidden")
}

const hideWinMessageButton = document.querySelector("#win-button");

if (hideWinMessageButton) {
    hideWinMessageButton.addEventListener("click", hideWinMessage);
}

document.querySelector("#win-background").addEventListener("click", (e) => {
    if (e.target.classList.contains("win-background")) {
        hideWinMessage();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hideWinMessage();
    }
});

function checkWin() {
    const slots = document.querySelectorAll(".slot");
    let correct = 0;

    slots.forEach(slot => {
        const piece = slot.querySelector(".piece");

        if (piece && piece.dataset.correctIndex === slot.dataset.index) {
            correct++;
        }
    });

    if (correct === SIZE * SIZE) {
        const finalTime = formatTime(elapsedTime);
        showWinMessage(finalTime)

        setTimeout(() => {
            stopTimer();
        }, 200);
    }
}