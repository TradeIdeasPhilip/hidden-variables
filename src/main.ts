// This is the preferred way to include a css file.
import "./style.css";

import { getById } from "phil-lib/client-misc";


class Sphere {
  /**
   * 
   * @param coverage How far the highlight should move to the right.
   * - 0 means none of the highlight shows.
   * - 1 means the highlight covers the entire circle.
   * - 0.5 means to cover exactly the left half with the highlight.
   * - 0.1 would highlight a small crescent on the left.
   * 
   * Strictly speaking, `coverage` is a ratio to say how much area of the _circle_ is being covered.
   * You'll have to do some math first if you want to simulate a rotating `sphere`.
   * @throws `coverage` must be between 0 and 1 (inclusive) or this will throw an exception.
   */
  static createHighlightFromLeft(coverage : number) {
    if (coverage < 0 || coverage > 1 || !isFinite(coverage)) {
      throw new Error("wtf");
    }
    const radius = 0.5;
    const top = `0,${-radius}`;
    const bottom = `0,${radius}`;
    const clockwise = "1";
    const counterclockwise = "0";
    const returningRadius = Math.abs(coverage-radius);
    const  returningDirection=(coverage <= 0.5)?clockwise:counterclockwise;
    const d = `M ${top} A ${radius},${radius} 3.14159 0 ${counterclockwise} ${bottom} A ${returningRadius},${radius} 3.14159 0 ${returningDirection} ${top}`;
    return d;
  }
  readonly #top = document.createElementNS("http://www.w3.org/2000/svg", "g");
  get top() {return this.#top;}
  readonly #orange = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  readonly #white = document.createElementNS("http://www.w3.org/2000/svg", "path");
  readonly #lightAndShadow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  constructor() {
    this.#top.append(this.#orange, this.#white, this.#lightAndShadow);
    this.#top.classList.add("sphere")
  }
  #yAngle = 0;
  get yAngle() {return this.#yAngle;}
  #zAngle = 0;
  get zAngle() {return this.#zAngle;}
  set zAngle(newValue) {
    this.#white.style.transform=`rotate(${newValue}rad)`;
  }
  #x = 0;
  get x() {return this.#x;}
  set x(newValue) {
    this.#x = newValue;
    this.#top.style.setProperty("--x", newValue + "px");
  }
  #y = 0;
  get y() {return this.#y;}
  set y(newValue) {
    this.#y = newValue;
    this.#top.style.setProperty("--y", newValue + "px");
  }
  #diameter = 1;
  get diameter() {return this.#diameter;}
  set diameter(newValue) {
    this.#diameter = newValue;
    this.#top.style.setProperty("--diameter", newValue.toString());
  }
}

console.log(Sphere.createHighlightFromLeft(5/6));

const testSvg = getById("test", SVGSVGElement);
const sphere = new Sphere();
testSvg.appendChild(sphere.top);
(window as any).sphere = sphere;
sphere.diameter = 2;
sphere.y = 2;
sphere.x = 1;
