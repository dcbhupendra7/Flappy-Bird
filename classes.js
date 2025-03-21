/**************************************************************
 * Bird Class
 **************************************************************/
class Bird {
  constructor() {
    // Position the bird near the left, vertically centered
    this.x = 50;
    this.y = height / 2;

    // Simple physics
    this.gravity = 0.3;
    this.lift = -5;
    this.velocity = 0;

    // Rotation (for small tilt effect)
    this.rotation = 0;

    // Size of the bird (can be adjusted)
    this.width = 34; // Based on your console log
    this.height = 24; // Based on your console log
  }

  show() {
    // Draw the current bird frame
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.rotation);
    image(birdFrames[birdFrameIndex], 0, 0, this.width, this.height);
    pop();
  }

  up() {
    this.velocity += this.lift;
    // Tilt the bird up a bit
    this.rotation = -0.2;
  }

  update() {
    this.velocity += this.gravity;

    // Limit upward and downward speed
    this.velocity = constrain(this.velocity, -6, 10);

    this.y += this.velocity;

    // Slowly straighten out after flapping
    this.rotation *= 0.9;

    // Keep the bird above the ground and below the top
    if (this.y > height - baseImgHeight) {
      this.y = height - baseImgHeight;
      this.velocity = 0;
    }
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
    this.w = 52; // Width of the pipe sprite after scaling
    this.speed = 2;
  }

  show() {
    // Bottom pipe
    push();
    imageMode(CORNER);
    image(pipeImg, this.x, height - this.bottom, this.w, this.bottom);
    pop();

    // Top pipe (flipped upside down)
    push();
    imageMode(CORNER);
    scale(1, -1); // Flip vertically
    image(pipeImg, this.x, -this.top, this.w, this.top);
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  hits(bird) {
    // Create a slightly smaller hitbox for more forgiving gameplay
    const hitboxShrink = 5;
    if (
      bird.x + hitboxShrink > this.x &&
      bird.x - hitboxShrink < this.x + this.w
    ) {
      if (
        bird.y + hitboxShrink < this.top ||
        bird.y - hitboxShrink > height - this.bottom
      ) {
        return true;
      }
    }
    return false;
  }
}
