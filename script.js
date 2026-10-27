const holes = document.querySelectorAll(".hole");
const scoreboard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const startButton = document.querySelector("#startGameBtn");
let lastHole;
let timeUp = false;
let score = 0;

// Hash Map to prevent users from clicking a mole multiple times in one go for multiple points.
// So prevents user from clicking hole 1 mole multiple times for 3 points.
const bonkedMap = new Map();

const randTime = (min, max) => {
  return Math.round(Math.random() + (max - min) + min);
};

const randHole = (holes) => {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];

  if (hole == lastHole) {
    return randHole(holes);
  }

  lastHole = hole;
  return hole;
};

const peep = () => {
  const time = randTime(200, 1000);
  const hole = randHole(holes);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) {
      console.log("peeped again");
      peep();
    }
  }, time);
};

const bonk = (e) => {
  if (!e.isTrusted) {
    return;
  }

  // Maximum they stay up for one second so just check if its been one second
  if (
    bonkedMap.has(e.target) &&
    Date.now() > 1000 + parseInt(bonkedMap.get(e.target))
  ) {
    score++;
    e.target.classList.remove("up");
    bonkedMap.delete(e.target);
    bonkedMap.set(e.target, Date.now());
  } else if (!bonkedMap.has(e.target)) {
    bonkedMap.set(e.target, Date.now());
    score++;
    e.target.classList.remove("up");
  } else {
    console.log("Not been a second.");
    bonkedMap.set(e.target, Date.now());
  }

  scoreboard.textContent = score;
};

const startGame = () => {
  console.log("Game started.");
  scoreboard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  setTimeout(() => {
    timeUp = true;
  }, 20000);
};

startButton.addEventListener("click", startGame);
moles.forEach((mole) => {
  mole.addEventListener("click", bonk);
});
