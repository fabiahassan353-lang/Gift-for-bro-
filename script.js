//Say wallahi bro 🥀//
const COOLDOWN = 9;
const COOLDOWN_MS = COOLDOWN * 60 * 60 * 1000;
const jarBtn = document.getElementById('jar-btn');
const textDisplay = document.getElementById('text-display');
const paperSlip = document.getElementById('paper-slip');
const timerMessage = document.getElementById('timer-message');

document.addEventListener('DOMContentLoaded', () => {
  checkCooldown();
});

jarBtn.addEventListener('click', async () => {
  if (isLocked()) return;

  try {
    const response = await fetch('texts.json');
    const data = await response.json();
    const notes = data.notes;

    // Grab a random note from the array
    const randomIndex = Math.floor(Math.random() * notes.length);
    const randomNote = notes[randomIndex];

    // Display the text
    textDisplay.innerText = randomNote;
    paperSlip.classList.add('animate');
    setTimeout(() => paperSlip.classList.remove('animate'), 400);
    const now = new Date().getTime();
    localStorage.setItem('lastJarPull', now);

    checkCooldown();
  } catch (error) {
    textDisplay.innerText = "Error loading notes. Make sure texts.json exists!";
    console.error(error);
  }
});

function isLocked() {
  const lastPull = localStorage.getItem('lastJarPull');
  if (!lastPull) return false;

  const now = new Date().getTime();
  return (now - parseInt(lastPull)) < COOLDOWN_MS;
}

function checkCooldown() {
  const lastPull = localStorage.getItem('lastJarPull');

  if (!lastPull) {
    jarBtn.disabled = false;
    timerMessage.innerText = "";
    return;
  }

  const now = new Date().getTime();
  const timePassed = now - parseInt(lastPull);

  if (timePassed < COOLDOWN_MS) {
    jarBtn.disabled = true;
    const timeLeft = COOLDOWN_MS - timePassed;
    updateTimerUI(timeLeft);
  } else {
    jarBtn.disabled = false;
    timerMessage.innerText = "The jar is ready for your next pull!";
  }
}

function updateTimerUI(timeLeft) {
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  timerMessage.innerText = `Jar locked! Next note available in: ${hours}h ${minutes}m ${seconds}s`;

  if (timeLeft > 0) {
    setTimeout(() => {
      const newTimeLeft = timeLeft - 1000;
      if (newTimeLeft > 0) {
        updateTimerUI(newTimeLeft);
      } else {
        checkCooldown();
      }
    }, 1000);
  }
}
