import * as ml from "ml-matrix";
declare const mlMatrix: typeof ml;

const { Matrix } = mlMatrix;

export class Network {
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
        let res = this.zipped.reduce((acc, [w, b]) => apply(w.mmul(acc).add(b), leakyReLu), input)

        console.assert(res.isColumnVector())

        return apply(res, sigmoid).getColumn(0)
    }
}

function apply(input: ml.Matrix, func: (v: number) => number): ml.Matrix {
    return new Matrix(input.to2DArray().map(r => r.map(func)))
}

function sigmoid(v: number): number {
    return 1 / (1 + exp(-v))
}

function leakyReLu(v: number): number {
    return v >= 0 ? v : v / 20;
}