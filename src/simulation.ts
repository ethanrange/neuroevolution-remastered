import { Car } from "./car.js";
import { Track } from "./track.js";
import { Network, networkFromStructure } from "./network.js";
import { Genetic } from "./genetic.js";

export class Simulation {
  generation: number;

  population: Car[];
  popSize: number;
  results: Car[];

  current: Car;
  best: Car;

  track: Track;

  constructor(track: Track, population: Car[]) {
    this.generation = 0;

    this.popSize = population.length;
    this.population = population;
    this.results = [];

    this.current = this.population[0];
    this.best = this.population[0];

    this.track = track;
  }

  newGeneration() {
    console.log(`Completed Generation ${this.generation}`);
    this.generation += 1;

    const meanFitness = this.results.reduce((sum, c) => sum + c.getFitness(), 0) / this.popSize;
    console.log(`Mean fitness: ${meanFitness}\n`);

    this.population = Genetic.generateChildren(this.results, this.generation);
    this.results = [];
  }

  displayTrack() {
    this.track.checkpoints.forEach(cp => cp.show());
    this.track.finish.show();
    this.track.walls.forEach(w => w.show());
  }

  displayGenerationInfo() {
    push();

    // Black size 25 text relative to enclosing box
    textSize(25);
    translate(20, height - 70);
    fill(0);

    // Enclosing box (970x50px)
    push();
    strokeWeight(5);
    stroke(0);
    fill(230);

    rect(0, 0, 970, 50);
    pop();

    // Information text
    text(`Generation number: ${this.generation + 1}`, 15, 35);
    text(`Best fitness: ${this.best.getFitness()} (${this.best.toString()})`, 320, 35);

    this.displayProgressBar();
    pop();
  }

  displayProgressBar() {
    text("Progress: ", 620, 35);

    // Progress bar (250x25px)
    push();
    noFill();
    stroke(0);
    rect(750, 13, 200, 25);
    pop();

    const barWidth = (1 - this.population.length / this.popSize) * 200;
    rect(750, 13, barWidth, 25);
  }

  displayNetworkInfo(x: number, y: number) {
    push();
    translate(x, y);

    strokeWeight(5);
    stroke(0);
    fill(230);

    rect(0, 0, 470, height - 40);

    fill(250);
    rect(30, 100, 410, 360);

    line(0, 580, 470, 580);
    line(0, 780, 470, 780);

    push();
    fill(0);
    noStroke();

    push();
    textAlign(CENTER);
    textSize(30);
    text("Current Car:", 235, 65);
    pop();

    textSize(25);

    text(`Current car number: ${this.current.id}`, 60, 510);
    text(`Current car ID: ${this.current.toString()}`, 60, 550);
    text(`Car Position: (${round(this.current.pos.x)}, ${round(this.current.pos.y)})`, 60, 630);
    text(`Car Score: ${this.current.collected.size}`, 60, 670);
    text(`Car Fitness: ${this.current.getFitness()}`, 60, 710);
    text("Time: x.xxx", 60, 750);

    pop();

    this.current.network.display();
    pop();
  }
}

function createPopulation(size: number, generation: number) {
  return new Array(size).fill(null).map((_, i) =>
    new Car(generation, i, networkFromStructure([7, 5, 5, 2]), createVector(412, 717), 7));
}

export function populationSim(track: Track, size: number) {
  console.assert(size != 0);
  return new Simulation(track, createPopulation(size, 1));
}

export function networkSim(track: Track, network: Network) {
  return new Simulation(track, [new Car(1, 1, network, createVector(412, 717), 7)]);
}
