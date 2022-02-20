import * as ml from "ml-matrix";
declare const mlMatrix: typeof ml;

const { Matrix } = mlMatrix;

export class Network {
  weights: ml.Matrix[];
  biases: ml.Matrix[];
  zipped: [ml.Matrix, ml.Matrix][];

  constructor(weights: ml.Matrix[], biases: ml.Matrix[]) {
    this.weights = weights;
    this.biases = biases;

    this.zipped = weights.map((w, i) => [w, biases[i]]);
  }

  display() {
    return;
  }

  feedforward(inputs: number[]): number[] {
    const input = Matrix.columnVector(inputs);
    const res = this.zipped.reduce((acc, [w, b], i) => apply(w.mmul(acc).add(b),
      i < this.weights.length - 1 ? leakyReLu : n => n), input);

    console.assert(res.isColumnVector());

    return apply(res, sigmoid).getColumn(0);
  }

  mutateWeights(mutation: (w: number) => number) {
    this.weights = this.weights.map(w => apply(w, mutation));
    this.zipped = this.weights.map((w, i) => [w, this.biases[i]]);
  }
}

function apply(input: ml.Matrix, func: (v: number) => number): ml.Matrix {
  return new Matrix(input.to2DArray().map(r => r.map(func)));
}

function sigmoid(v: number): number {
  return 1 / (1 + exp(-v));
}

function leakyReLu(v: number): number {
  return v >= 0 ? v : v / 20;
}

export function networkFromStructure(structure: number[]): Network {
  const transfers = structure.length - 1;
  const weights = Array(transfers);
  const biases = Array(transfers);

  for (let i = 0; i < structure.length - 1; i++) {
    weights[i] = Matrix.rand(structure[i + 1], structure[i], { random: () => random(-1, 1) });
    biases[i] = Matrix.ones(structure[i + 1], 1);
  }

  return new Network(weights, biases);
}