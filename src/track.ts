import { tracks } from "./app.js";

export class Track {
  id: number;

  walls: Wall[];
  finish: Wall;
  checkpoints: Checkpoint[];

  constructor(id: number) {
    this.id = id;

    this.walls = tracks[id]["walls"].map(v => new Wall(...Track.toVecs(v), color(0)));
    this.finish = new Wall(...Track.toVecs(tracks[id]["finish"]), color(0, 230, 0));
    this.checkpoints = tracks[id]["cps"].map((v, i) => 
      new Checkpoint(...Track.toVecs(v), color(255, 0, 255), i));
  }

  static toVecs(ps: number[]): [p5.Vector, p5.Vector] {
    return [createVector(ps[0], ps[1]), createVector(ps[2], ps[3])];
  }
}

export class Wall {
  start: p5.Vector;
  end: p5.Vector;
  colour: p5.Color;

  constructor(start: p5.Vector, end: p5.Vector, colour: p5.Color) {
    this.start = start;
    this.end = end;
    this.colour = colour;
  }

  show() {
    push();
    stroke(this.colour);
    strokeWeight(2);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
    pop();
  }
}

export class Checkpoint extends Wall {
  id: number;

  constructor(start: p5.Vector, end: p5.Vector, colour: p5.Color, id: number) {
    super(start, end, colour);
    this.id = id;
  }
}
