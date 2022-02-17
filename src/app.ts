function setup() {
  console.log("Program initialised");

  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(240);

  fill(color(50))
  circle(mouseX, mouseY, 25)
}