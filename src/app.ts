import {} from "p5/global";

import { Simulation, populationSim } from "./simulation.js"
import { Track, Wall, Checkpoint } from "./track.js"
import { Car } from "./car.js"

(globalThis as any).preload = function () {
  let trackFiles: string[] = ["track1", "track2"];
  tracks = trackFiles.map(n => loadJSON(`src/resources/${n}.json`) as TrackStore)
};

(globalThis as any).windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

(globalThis as any).setup = function () {
  console.log("Program initialised");

  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER);
  frameRate(60);

  simulation = populationSim(new Track(0), 1);
};

(globalThis as any).draw = function () {
  drawBackground();

  // Display information data and track
  simulation.displayGenerationInfo()
  simulation.displayNetworkInfo(1010, 20)
  simulation.displayTrack()

  handleMovement(simulation.current);

  if (handleIntersections(simulation.current)) return;
};

let simulation: Simulation;
export let tracks: TrackStore[];

interface TrackStore {
  "finish": number[]
  "walls": number[][];
  "cps": number[][];
}

function drawBackground() {
  let c1: p5.Color = color(63, 191, 191), c2: p5.Color = color(200, 230, 255);

  for (let y = 0; y < height; y++) {
    let normY = map(y, 0, height, 0, 1);
    stroke(lerpColor(c1, c2, normY));
    line(0, y, width, y);
  }
}

function readControls(): [number, p5.Vector] {
  let steering = keyIsDown(LEFT_ARROW) ? -0.05 : keyIsDown(RIGHT_ARROW) ? 0.05 : 0
  let accel = keyIsDown(UP_ARROW) ? 1 : keyIsDown(DOWN_ARROW) ? -1 : 0

  return [steering, createVector(0, accel)]
}

function handleMovement(car: Car) {
  // Update control input
  let [steering, force] = readControls();
  car.applyForce(force.rotate(car.angle - PI / 2))
  car.angle += steering

  // Move and display car
  car.move()
  car.show()
}

function handleIntersections(car: Car): boolean {
  // Reset the run if a wall is collided with
  if (car.panels.filter(p => simulation.track.walls.filter((w: Wall) =>
    p.intersect(w)).length > 0).length) {
    car.reset()
    return true;
  }

  // Store a set of contacted checkpoints
  car.panels.forEach(p => simulation.track.checkpoints.forEach((cp: Checkpoint) => {
    if (p.intersect(cp)) {
      car.collected = car.collected.add(cp.id)
    }
  }))

  // Draw sensors to the nearest wall in each direction
  for (let sensor of car.sensors) {
    let intersections = simulation.track.walls.map((w: Wall) => 
      sensor.intersect(w)).filter(i => i) as p5.Vector[]

    if (intersections.length) {
      let [closest, dist] = intersections.map(i => [i, p5.Vector.dist(car.pos, i)])
        .reduce(([min, md], [nxt, nd]) => (md < nd ? [min, md] : [nxt, nd])) as [p5.Vector, number]

      sensor.show(closest, dist)
    }
  }

  // Reset run on successful completion
  car.panels.forEach(p => {
    if (p.intersect(simulation.track.finish) &&
      car.collected.size == simulation.track.checkpoints.length) {
      console.log("Success!");
      car.reset();
      return true;
    }
  })

  return false;
}
