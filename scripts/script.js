const SIZE = 4;
const pieceSize = 100;

const board = document.getElementById("board");
const piecesContainer = document.getElementById("puzzle");

let selectedImage = null;

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
                sx + (x * sourcePieceSize),
                sy + (y * sourcePieceSize),
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

            pieces.push(piece);
        }
    }

    renderPuzzle(pieces);
}

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

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function dropPiece(e) {
    if (!draggedPiece) return;

    e.target.innerHTML = "";
    e.target.appendChild(draggedPiece);

    setTimeout(checkWin, 300);
}

function checkWin() {
    const slots = document.querySelectorAll(".slot");
    let correctCount = 0;

    slots.forEach(slot => {
        const piece = slot.querySelector(".piece");
        if (piece && piece.dataset.correctIndex === slot.dataset.index) {
            correctCount++;
        }
    });

    if (correctCount === SIZE * SIZE) {
        alert("Brawo! Poprawnie ułożyłeś obrazek!");
    }
}
