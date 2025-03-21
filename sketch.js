/**************************************************************
 * p5.js Sketch
 **************************************************************/

// Global image variables
let bgImg, baseImg, pipeImg;
let birdFrames = [];

// We'll store the final scaled heights
let baseImgHeight;
let pipeImgHeight;

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

function preload() {
  // Load images
  bgImg = loadImage("background-white.png");
  baseImg = loadImage("base.png");
  pipeImg = loadImage("pipe-green.png");

  birdFrames[0] = loadImage("redbird-downflap.png");
  birdFrames[1] = loadImage("redbird-midflap.png");
  birdFrames[2] = loadImage("redbird-upflap.png");
}

function setup() {
  // We'll assume 288×512 canvas, the classic Flappy Bird size
  createCanvas(288, 512);

  // 1) Check each image's natural size:
  console.log("bgImg:", bgImg.width, bgImg.height);
  console.log("baseImg:", baseImg.width, baseImg.height);
  console.log("pipeImg:", pipeImg.width, pipeImg.height);
  console.log("birdFrames:", birdFrames[0].width, birdFrames[0].height);

  // 2) If the base image is 336 wide, but our canvas is 288 wide,
  //    we scale the height proportionally:
  //    scaleFactor = 288 / baseImg.width
  let baseScale = width / baseImg.width;
  baseImgHeight = baseImg.height * baseScale;

  // 3) For the pipe, we want it 52 px wide. Let's see the original ratio:
  //    scaleFactor = 52 / pipeImg.width
  let pipeScale = 52 / pipeImg.width;
  pipeImgHeight = pipeImg.height * pipeScale;

  // If your bird is too large, you can scale in Bird.show() or here.

  // Create the bird and start with one pipe
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  if (gameOver) {
    // Dim screen, show "Game Over"
    background(0, 150);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("GAME OVER\nPress SPACE to Restart", width / 2, height / 2);
    return;
  }

  // 1) Draw the background to fill the canvas
  image(bgImg, 0, 0, width, height);

  // 2) Animate bird flapping
  birdFrameCounter++;
  if (birdFrameCounter % birdFrameDelay === 0) {
    birdFrameIndex = (birdFrameIndex + 1) % birdFrames.length;
  }

  // 3) Spawn pipes every 90 frames
  if (frameCount % 90 === 0) {
    pipes.push(new Pipe());
  }

  // Update & draw pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
      score++;
    }

    if (pipes[i].hits(bird)) {
      gameOver = true;
    }
  }

  // 4) Bird
  bird.update();
  bird.show();

  // 5) Scrolling ground
  baseX -= baseSpeed;
  if (baseX <= -width) {
    baseX = 0;
  }
  // Draw two copies of base image, scaled to the canvas width, at bottom
  image(baseImg, baseX, height - baseImgHeight, width, baseImgHeight);
  image(baseImg, baseX + width, height - baseImgHeight, width, baseImgHeight);

  // 6) Score
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text(score, width / 2, 10);
}

function keyPressed() {
  if (key === " ") {
    if (gameOver) {
      // Restart
      gameOver = false;
      score = 0;
      pipes = [];
      bird = new Bird();
      frameCount = 0;
      pipes.push(new Pipe());
    } else {
      // Bird flap
      bird.up();
    }
  }
}
