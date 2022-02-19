import * as ml from "ml-matrix";
declare const mlMatrix: typeof ml;

const { Matrix } = mlMatrix;

export class Network {
    id: number = 0;
    weights: ml.Matrix[];
    biases: ml.Matrix[]; 
    zipped: [ml.Matrix, ml.Matrix][]

    constructor(structure: number[]) {
        let transfers = structure.length - 1;
        this.weights = Array(transfers);
        this.biases = Array(transfers);

        for (let i = 0; i < structure.length - 1; i++) {
            this.weights[i] = Matrix.rand(structure[i + 1], structure[i], 
                { random: () => random(-1, 1)});
            this.biases[i] = Matrix.ones(structure[i + 1], 1);
        }

        this.zipped = this.weights.map((w, i) => [w, this.biases[i]])
    }

    display() {
        
    }

    feedforward(inputs: number[]): number[] {
        let input = Matrix.columnVector(inputs)

        let result = this.zipped.reduce((acc, [w, b]) => w.mmul(acc).add(b), input)

        console.assert(result.isColumnVector())

        return result.getColumn(0)
    }
}