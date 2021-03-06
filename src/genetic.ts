import * as ml from "ml-matrix";

import { Car } from "./car.js";
import { Network } from "./network.js";

export abstract class Genetic {
  static generateChildren(population: Car[], generation: number): Car[] {
    const results = population.sort((fc, sc) => sc.getFitness() - fc.getFitness());

    // scanLeft
    const [sum, cumulative]: [number, number[]] = results.reduce(([partial, csums], nc) => {
      const next: number = partial + nc.getFitness();
      return [next, [...csums, next]];
    }, [0, [] as number[]]);

    const next = results.slice(0, 5).map(c =>
      new Car(c.generation, c.id, c.network, createVector(412, 717), 7));

    while (next.length < population.length) {
      const [firstIndex, secondIndex] = [this.select(cumulative, sum), this.select(cumulative, sum)];

      if (firstIndex != secondIndex) {
        const [firstParent, secondParent] = [results[firstIndex], results[secondIndex]];
        
        const weights = firstParent.network.weights.map((w, i) => [w, secondParent.network.weights[i]]);

        const selectedChild = int(random(0, 2));
        const newWeights = weights.map(([fm, sm]) => this.crossover(fm, sm)[selectedChild]);

        const childNetwork = new Network(newWeights, firstParent.network.biases);

        childNetwork.mutateWeights(this.mutate);

        const newCar = new Car(generation, next.length - 5, childNetwork, createVector(412, 717), 7);

        next.push(newCar);
      }
    }

    return next;
  }

  static select(cumulative: number[], sum: number): number {
    const search = random(sum);
    return cumulative.findIndex(f => { if (f >= search) return true; });
  }

  static mutate(w: number): number {
    return random() < 0.4 ? w + randomGaussian(0, 1) * 0.5 : w;
  }

  static crossover(fmat: ml.Matrix, smat: ml.Matrix): [ml.Matrix, ml.Matrix] {
    const [pivotRow, pivotColumn] = selectPivot(fmat);
    const [fchild, schild] = [smat.clone(), fmat.clone()];

    for (let i = 0; i < pivotRow; i++) {
      for (let j = 0; j < pivotColumn; j++) {
        fchild.set(i, j, fmat.get(i, j));
        schild.set(i, j, smat.get(i, j));
      }
    }

    return [fchild, schild];
  }
}

function selectPivot(mat: ml.Matrix): [number, number] {
  return [int(random(0, mat.rows - 1)), int(random(0, mat.columns - 1))];
}