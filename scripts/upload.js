const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("click", () => {
    // Tworzymy input dynamicznie, jesli nie ma go w HTML
    if (!fileInput) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => handleFile(e.target.files[0]);
        input.click();
    } else {
        fileInput.click();
    }
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.parentElement.style.transform = "rotate(0deg) scale(1.1)";
    dropZone.parentElement.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.8)";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.parentElement.style.transform = "rotate(2deg) scale(1)";
    dropZone.parentElement.style.boxShadow = "none";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.parentElement.style.transform = "rotate(2deg) scale(1)";
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        handleFile(file);
    }
});

function handleFile(file) {
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Usun zaznaczenie z innych polaroidow
            document.querySelectorAll(".polaroid").forEach(p => p.classList.remove("selected"));
            
            // Wywolanie funkcji z pliku script.js
            if (typeof sliceImage === "function") {
                sliceImage(img);
            } else {
                console.error("Funkcja sliceImage nie zostala znaleziona w script.js");
            }
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}