let simulation: Simulation;
let tracks: TrackStore[];

interface TrackStore {
  "finish": number[]
  "walls": number[][];
  "cps": number[][];
}

function preload() {
  let trackFiles: string[] = ['track1'];
  tracks = trackFiles.map(n => loadJSON(`src/resources/${n}.json`) as TrackStore)
}

function setup() {
  console.log("Program initialised");

  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER);
  frameRate(60);

  simulation = populationSim(new Track(0), 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawBackground() {
  let c1: p5.Color = color(63, 191, 191),  c2: p5.Color = color(200, 230, 255);

  for (let y = 0; y < height; y++) {
    let normY = map(y, 0, height, 0, 1);
    stroke(lerpColor(c1, c2, normY));
    line(0, y, width, y);
  }
}

function draw() {
  drawBackground();

  fill(color(50));
  noStroke();
  circle(mouseX, mouseY, 25);

  let steering = 0;
  
  if (keyIsDown(LEFT_ARROW)) {
    steering = -0.05
  } else if (keyIsDown(RIGHT_ARROW)) {
    steering = 0.05
  }

  let accel = 0;
  
  if (keyIsDown(UP_ARROW)) {
    accel = 1
  } else if (keyIsDown(DOWN_ARROW)) {
    accel = -1
  }

  let force = createVector(0, accel)
  simulation.current.applyForce(force.rotate(simulation.current.angle - PI / 2))
  simulation.current.angle += steering

  simulation.current.move()

  let collide = simulation.current.panels.filter(p => 
    simulation.track.walls.filter(w => p.intersect(w)).length > 0)
  
  if (collide.length) {
    simulation.reset()
    return
  }

  for (let sensor of simulation.current.sensors) {
    let intersections = simulation.track.walls.map(w => sensor.intersect(w)).filter(i => i)

    if (intersections.length) {
      push()
      fill(255, 0, 0)
      intersections.forEach(i => circle(i.x, i.y, 10))
      pop()
    }
  }

  simulation.current.show()

  simulation.displayGenerationInfo()
  simulation.displayNetworkInfo(1010, 20)
  simulation.displayTrack()
}
