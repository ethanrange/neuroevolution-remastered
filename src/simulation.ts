class Simulation {
    generation: number;
    population: Car[];

    current: Car;
    best: Car;

    track: Track;

    constructor(track: Track, population: Car[]) {
        this.generation = 0;
        this.population = population;

        this.current = this.best = this.population[0];

        this.track = track;
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
        text(`Best fitness: ${this.best.fitness} (${this.best.id})`, 320, 35);
        
        this.displayProgressBar();
        pop();
    }

    displayProgressBar() {
        text('Progress: ', 620, 35);
        
        // Progress bar (250x25px)
        push();
        noFill();
        stroke(0);
        rect(750, 13, 200, 25);
        pop();

        let barWidth = (200.0 / this.population.length) * (this.current.id + 1);
        rect(750, 13, barWidth, 25);
    }
}

function populationSim(track: Track, size: number) {
    console.assert(size != 0)
    let population = new Array(size).fill(null).map((_, i) => new Car(1, i, new Network()))
    return new Simulation(track, population)
}

function networkSim(track: Track, network: Network) {
    return new Simulation(track, [new Car(1, 1, network)])
}
