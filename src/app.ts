import { } from "p5/global";

import { Simulation, populationSim } from "./simulation.js";
import { Track, Wall, Checkpoint } from "./track.js";
import { Car } from "./car.js";

const POPULATION_SIZE = 50;

globalThis.preload = function () {
  const trackFiles: string[] = ["track1", "track2"];
  tracks = trackFiles.map(n => loadJSON(`src/resources/${n}.json`) as TrackStore);
};

globalThis.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

globalThis.setup = function () {
  console.log("Program initialised");

  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER);
  frameRate(60);

  simulation = populationSim(new Track(0), POPULATION_SIZE);
  console.log("Simulation created: ", simulation);
};

globalThis.draw = function () {
  drawBackground();

  // Display information data and track
  simulation.displayGenerationInfo();
  simulation.displayNetworkInfo(1010, 20);
  simulation.displayTrack();

  simulation.population.slice(0, 5).forEach(rc => {
    rc.elapsed += deltaTime;

    const readings = handleIntersections(rc);

    if (readings && rc.elapsed / 1000 < 5 + rc.collected.size) {
      handleMovement(rc, readings);
    } else {
      if (rc.getFitness() > simulation.best.getFitness()) {
        simulation.best = rc;
      }

      simulation.population = simulation.population.filter(pc => pc != rc);
      simulation.results.push(rc);
    }
  });

  // Generation is complete
  if (!simulation.population.length) {
    simulation.newGeneration();
  }
};

let simulation: Simulation;
export let tracks: TrackStore[];

interface TrackStore {
  "finish": number[]
  "walls": number[][];
  "cps": number[][];
}

function drawBackground() {
  const c1: p5.Color = color(63, 191, 191), c2: p5.Color = color(200, 230, 255);

  for (let y = 0; y < height; y++) {
    const normY = map(y, 0, height, 0, 1);
    stroke(lerpColor(c1, c2, normY));
    line(0, y, width, y);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readControls(): [number, p5.Vector] {
  const steering = keyIsDown(LEFT_ARROW) ? -0.05 : keyIsDown(RIGHT_ARROW) ? 0.05 : 0;
  const accel = keyIsDown(UP_ARROW) ? 1 : keyIsDown(DOWN_ARROW) ? -1 : 0;

  return [steering, createVector(0, accel)];
}

function readNetwork(car: Car, readings: number[]): [number, p5.Vector] {
  const [steer, acc] = car.network.feedforward(readings);
  const steering = steer <= 1 / 3 ? 0.05 : steer >= 2 / 3 ? -0.05 : 0;

  return [steering, createVector(0, acc)];
}

function handleMovement(car: Car, readings: number[]) {
  // Update control input
  // let [steering, force] = readControls();

  // Fetch neural network results
  const [steering, force] = readNetwork(car, readings);

  car.applyForce(force.rotate(car.angle - PI / 2));
  car.angle += steering;

  // Move and display car
  car.move();
  car.show();
}

function handleIntersections(car: Car): number[] | undefined {
  // Reset the run if a wall is collided with
  if (car.panels.filter(p => simulation.track.walls.filter((w: Wall) =>
    p.intersect(w)).length > 0).length) {
    return;
  }

  // Store a set of contacted checkpoints
  car.panels.forEach(p => simulation.track.checkpoints.forEach((cp: Checkpoint) => {
    if (p.intersect(cp)) {
      car.collected = car.collected.add(cp.id);
    }
  }));

  const readings: number[] = [];

  // Draw sensors to the nearest wall in each direction
  for (const sensor of car.sensors) {
    const intersections = simulation.track.walls.map((w: Wall) =>
      sensor.intersect(w)).filter(i => i) as p5.Vector[];

    if (intersections.length) {
      const [closest, dist] = intersections.map(i => [i, p5.Vector.dist(car.pos, i)])
        .reduce(([min, md], [nxt, nd]) => (md < nd ? [min, md] : [nxt, nd])) as [p5.Vector, number];

      sensor.show(closest, dist);
      readings.push(dist / 500);
    } else {
      readings.push(10000);
    }
  }

  // Reset run on successful completion
  car.panels.forEach(p => {
    if (p.intersect(simulation.track.finish) &&
      car.collected.size == simulation.track.checkpoints.length) {
      console.log("Success!");
      return;
    }
  });

  return readings;
}
