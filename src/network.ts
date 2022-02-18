import * as mlmtx from "ml-matrix";
declare const mlMatrix: typeof mlmtx;

const { Matrix } = mlMatrix;

export class Network {
    id: number = 0;
    matrix: mlmtx.Matrix;

    constructor() {
        this.matrix = Matrix.ones(5, 5);
    }

    display() {

    }
}