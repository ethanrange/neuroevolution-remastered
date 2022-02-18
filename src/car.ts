class Car {
    generation: number;
    id: number;
    network: Network;
    fitness: number;

    pos: p5.Vector;
    vel: p5.Vector;
    acc: p5.Vector;

    dims: p5.Vector
    angle: number;

    sensors: Sensor[];
    panels: Panel[];

    constructor(generation: number, id: number, network: Network, start: p5.Vector, sensors: number) {
        this.generation = generation;
        this.id = id;
        this.network = network;

        this.fitness = 0;

        this.pos = start;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.dims = createVector(20, 30)
        this.angle = radians(10)

        this.sensors = this.generateSensors(sensors)
        this.panels = this.generatePanels()
    }

    show() {
        push()
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);

        this.panels.forEach(p => p.show())
        circle(0, 0, 5)

        stroke(0)
        strokeWeight(1)

        line(0, 0, this.dims.y / 2 + 5, 0);

        rotate(-3 * PI / 4);
        this.sensors.forEach(s => s.show());

        pop()
    }

    move() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0)

        this.vel.limit(5)

        let drag = p5.Vector.mult(this.vel, -0.05)
        this.applyForce(drag)
    }

    applyForce(force: p5.Vector) {
        this.acc.add(force)
    }

    generatePanels(): Panel[] {
        let offsets: [number, number, number, number][] = [
            [-1, -1, -1, 1],
            [1, 1, 1, -1],
            [-1, -1, 1, -1],
            [1, 1, -1, 1]]

        let [hw, hh] = [this.dims.x / 2, this.dims.y / 2]

        return offsets.map(o =>
            new Panel(this, createVector(hh * o[0], hw * o[1]), createVector(hh * o[2], hw * o[3]))
        )
    }

    generateSensors(count: number): Sensor[] {
        let spacing = PI / (count - 1)
        return Array(count).fill(null).map((_, i) => new Sensor(this, i * spacing))
    }

    toString(): string {
        return `${this.generation}:${this.id}`
    }
}
class Sensor {
    owner: Car;
    direction: p5.Vector;
    spacing: number;

    constructor(owner: Car, spacing: number) {
        this.owner = owner;
        this.spacing = spacing;
        this.direction = p5.Vector.fromAngle(spacing)
    }

    show() {
        push()
        stroke(0)
        strokeWeight(1)

        rotate(this.spacing)
        line(0, 0, 100, 100)

        pop()
    }
}

class Panel {
    start: p5.Vector;
    end: p5.Vector;

    owner: Car;

    constructor(owner: Car, start: p5.Vector, end: p5.Vector) {
        this.owner = owner;

        this.start = start;
        this.end = end;
    }

    show() {
        push()
        stroke(0)
        strokeWeight(1)

        line(this.start.x, this.start.y, this.end.x, this.end.y)
        pop()
    }
}