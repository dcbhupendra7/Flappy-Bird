/**************************************************************
 * p5.js Sketch
 **************************************************************/

// Global image variables
let bgImg, baseImg, pipeImg;
let birdFrames = [];

// We'll store the final scaled heights
let baseImgHeight;

// Bird animation
let birdFrameIndex = 0;
let birdFrameDelay = 5;
let birdFrameCounter = 0;

// Game objects
let bird;
let pipes = [];

// Ground (base) scroll
let baseX = 0;
let baseSpeed = 2;

// Game state
let gameOver = false;
let score = 0;

// Debug mode
const DEBUG = true;

function preload() {
  // Load images with success and error callbacks
  bgImg = loadImage(
    "background-white.png",
    () => console.log("Background loaded successfully"),
    () => console.error("Failed to load background")
  );

  baseImg = loadImage(
    "base.png",
    () => console.log("Base loaded successfully"),
    () => console.error("Failed to load base")
  );

  pipeImg = loadImage(
    "pipe-green.png",
    () => console.log("Pipe loaded successfully"),
    () => console.error("Failed to load pipe")
  );

  // Load bird animation frames
  birdFrames[0] = loadImage(
    "redbird-downflap.png",
    () => console.log("Bird down loaded successfully"),
    () => console.error("Failed to load bird down")
  );

  birdFrames[1] = loadImage(
    "redbird-midflap.png",
    () => console.log("Bird mid loaded successfully"),
    () => console.error("Failed to load bird mid")
  );

  birdFrames[2] = loadImage(
    "redbird-upflap.png",
    () => console.log("Bird up loaded successfully"),
    () => console.error("Failed to load bird up")
  );
}

function setup() {
  // We'll assume 288×512 canvas, the classic Flappy Bird size
  createCanvas(800, 700);

  // Log loaded image dimensions for debugging
  if (DEBUG) {
    console.log("bgImg:", bgImg.width, bgImg.height);
    console.log("baseImg:", baseImg.width, baseImg.height);
    console.log("pipeImg:", pipeImg.width, pipeImg.height);
    console.log("birdFrames:", birdFrames[0].width, birdFrames[0].height);
  }

  // Calculate scaled base height (maintain aspect ratio)
  // From your console.log, the base image height is 112
  baseImgHeight = 112;

  // Create the bird and start with one pipe
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  // Game over state
  if (gameOver) {
    // Dim screen, show "Game Over"
    background(0, 150);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("GAME OVER\nPress SPACE to Restart", width / 2, height / 2);
    return;
  }

  // 1) Draw the background
  image(bgImg, 0, 0, width, height);

  // 2) Update & draw pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    // Check if pipe is off screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
      score++;
    }

    // Check for collision
    if (pipes[i].hits(bird)) {
      gameOver = true;
    }
  }

  // 3) Animate bird flapping
  birdFrameCounter++;
  if (birdFrameCounter % birdFrameDelay === 0) {
    birdFrameIndex = (birdFrameIndex + 1) % birdFrames.length;
  }

  // 4) Update & draw bird
  bird.update();
  bird.show();

  // 5) Spawn pipes every 90 frames
  if (frameCount % 90 === 0) {
    pipes.push(new Pipe());
  }

  // 6) Scrolling ground
  baseX -= baseSpeed;
  if (baseX <= -width) {
    baseX = 0;
  }

  // Draw two copies of base image side by side for infinite scrolling
  image(baseImg, baseX, height - baseImgHeight, width, baseImgHeight);
  image(baseImg, baseX + width, height - baseImgHeight, width, baseImgHeight);

  // 7) Score
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text(score, width / 2, 10);
}

function keyPressed() {
  if (key === " " || keyCode === UP_ARROW) {
    if (gameOver) {
      // Restart game
      resetGame();
    } else {
      // Bird flap
      bird.up();
    }
  }
}

function mousePressed() {
  // Allow mouse clicks to flap too
  if (gameOver) {
    resetGame();
  } else {
    bird.up();
  }
}

function resetGame() {
  gameOver = false;
  score = 0;
  pipes = [];
  bird = new Bird();
  frameCount = 0;
  pipes.push(new Pipe());
}
