const audioElements = document.querySelectorAll("audio");
const squares = document.querySelectorAll(".square");
const rectangle = document.querySelector(".container");
const playButton = document.getElementById("play-button");
const speedLabel = document.getElementById("speed");
const speedRange = document.getElementById("speedRange");

/* ------------------------------ configuratoin ----------------------------- */

let speed = 5;
let minHeight = 50;
let diffHeight = 10;

speedLabel.innerText = speed;

const keyLen = squares.length;

speedRange.addEventListener("input", () => {
  speed = speedRange.value;
  speedLabel.innerText = speed;
});

let squareData = initializeSquareData();

function initializeSquareData() {
  const squareData = [];
  for (let i = 0; i < keyLen; i++) {
    const y = 0;

    squareData.push({
      element: squares[i],
      y,
      height: minHeight + (keyLen - i - 1) * diffHeight,
      directionY: 1,
    });

    squares[i].style.height = squareData[i].height + "px";
  }

  return squareData;
}

function resetSquareData() {
  squareData = initializeSquareData();
  for (const square of squareData) {
    square.element.style.transform = `translateY(${square.y}px)`;
  }
}

function updateSquareData() {
  for (const [i, square] of squareData.entries()) {
    square.height = minHeight + (keyLen - i - 1) * diffHeight;
    square.element.style.height = square.height + "px";
  }
}

/* -------------------------------- animation ------------------------------- */

let animationId = null;

function animate() {
  for (const [index, square] of squareData.entries()) {
    square.y += speed * square.directionY;
    if (square.y < 0) {
      square.y = 0;
      square.directionY = 1;
    } else if (square.y > rectangle.offsetHeight - square.height) {
      square.y = rectangle.offsetHeight - square.height;
      square.directionY = -1;

      const audioElement = audioElements[index];
      audioElement.currentTime = 0;
      audioElement.play();

      square.element.classList.add("active");

      setTimeout(() => {
        square.element.classList.remove("active");
      }, 700);
    }

    square.element.style.transform = `translateY(${square.y}px)`;
  }

  animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
  cancelAnimationFrame(animationId);
  animationId = null;
  resetSquareData();
}

function toggleAnimation() {
  if (animationId === null) {
    playButton.src = "assets/images/pause_button.svg";
    animate();
  } else {
    playButton.src = "assets/images/play_button.svg";
    stopAnimation();
  }
}

playButton.addEventListener("click", toggleAnimation);

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    toggleAnimation();
  }
});
