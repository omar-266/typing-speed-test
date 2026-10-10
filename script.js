const sampleText = "The quick brown fox jumps over the lazy dog and runs quickly through the green forest to find some food before the sun sets completely behind the tall mountains.";

const textDisplay = document.getElementById("text-display");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");

let timeLeft = 60;
let timeTotal = 60;
let timer = null;
let isTyping = false;
let charIndex = 0;
let mistakes = 0;

function loadParagraph() {
    textDisplay.innerHTML = "";
    sampleText.split("").forEach(char => {
        let span = `<span>${char}</span>`;
        textDisplay.innerHTML += span;
    });
    textDisplay.querySelectorAll("span")[0].classList.add("active");
}

function initTyping(e) {
    const characters = textDisplay.querySelectorAll("span");
    
    // Start timer on first key press
    if (!isTyping) {
        isTyping = true;
        timer = setInterval(initTimer, 1000);
    }

    // Handle Backspace
    if (e.key === "Backspace") {
        if (charIndex > 0) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
            characters.forEach(span => span.classList.remove("active"));
            characters[charIndex].classList.add("active");
        }
        return;
    }

    // Check if valid character key was typed
    if (e.key.length === 1 && charIndex < characters.length) {
        if (characters[charIndex].innerText === e.key) {
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        
        characters[charIndex].classList.remove("active");
        charIndex++;
        
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        } else {
            clearInterval(timer);
        }
        
        calculateStats();
    }
}

function calculateStats() {
    let timeElapsed = timeTotal - timeLeft;
    
    if (timeElapsed > 0) {
        let correctChars = charIndex - mistakes;
        
        // WPM Calculation
        let wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
        wpmDisplay.innerText = wpm < 0 || !wpm || !isFinite(wpm) ? 0 : wpm;
        
        // Accuracy Calculation (Total correct / Total typed attempts)
        // We ensure we don't divide by zero if charIndex is 0
        let totalAttempts = charIndex + mistakes; // or track total keypresses
        let accuracy = charIndex > 0 ? Math.round((correctChars / charIndex) * 100) : 100;
        
        // Prevent negative accuracy if mistakes somehow outpace index
        accuracy = Math.max(0, Math.min(100, accuracy));
        
        accuracyDisplay.innerText = `${accuracy}%`;
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = `${timeLeft}s`;
        calculateStats();
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    clearInterval(timer);
    timeLeft = 60;
    timeTotal = 60;
    timerDisplay.innerText = `${timeLeft}s`;
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "100%";
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    loadParagraph();
}

loadParagraph();
document.addEventListener("keydown", initTyping);
restartBtn.addEventListener("click", resetGame);