/**************************************************************
 * Bird Class
 **************************************************************/
class Bird {
  constructor() {
    // Position the bird near the left, vertically centered
    this.x = 50;
    this.y = height / 2;

    // Simple physics
    this.gravity = 0.6;
    this.lift = -10;
    this.velocity = 0;

    // Rotation (for small tilt effect)
    this.rotation = 0;
  }

  show() {
    // We'll choose the current flap frame in sketch.js using birdFrameIndex
    imageMode(CENTER);

    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    image(birdFrames[birdFrameIndex], 0, 0);
    pop();
  }

  up() {
    // Strong upward velocity
    this.velocity += this.lift;
    // Tilt the bird up a bit
    this.rotation = -0.3;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Slowly straighten out after flapping
    this.rotation *= 0.9;

    // Prevent going below the base
    if (this.y > height - baseImgHeight) {
      this.y = height - baseImgHeight;
      this.velocity = 0;
    }
    // Prevent going above the top
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
}

/**************************************************************
 * Pipe Class
 **************************************************************/
class Pipe {
  constructor() {
    // Gap between top and bottom
    this.spacing = 100;
    // Random top portion
    this.top = random(50, height / 2);
    // Bottom portion
    this.bottom = height - (this.top + this.spacing);

    this.x = width;
    this.w = 52; // We'll scale horizontally to 52 px
    this.speed = 2;
  }

  show() {
    // Bottom pipe: drawn upright
    // We'll scale its height proportionally in sketch.js
    image(pipeImg, this.x, height - this.bottom, this.w, pipeImgHeight);

    // Top pipe: same sprite, but rotated 180 degrees
    push();
    translate(this.x + this.w / 2, this.top);
    rotate(PI); // 180 degrees
    imageMode(CENTER);
    // Draw the pipe so that "bottom" aligns with this.top
    image(pipeImg, 0, 0, this.w, pipeImgHeight);
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  hits(bird) {
    // Basic bounding-box collision
    if (bird.x > this.x && bird.x < this.x + this.w) {
      if (bird.y < this.top || bird.y > height - this.bottom) {
        return true;
      }
    }
    return false;
  }
}
