import module = require("p5");
export = module;
export as namespace p5;

declare global {
    function preload(): void;
    function windowResized(): void;
    function setup(): void;
    function draw(): void;
}