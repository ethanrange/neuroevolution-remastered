class Car {
    generation: number;
    id: number;
    network: Network;
    fitness: number;

    constructor(generation: number, id: number, network: Network) {
        this.generation = generation;
        this.id = id;
        this.network = network;

        this.fitness = 0;
    }

    toString(): string {
        return `${this.generation}:${this.id}`
    }
}