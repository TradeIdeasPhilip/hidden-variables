// This is the preferred way to include a css file.
import "./style.css";

import { getById } from "phil-lib/client-misc";
import { positiveModulo } from "./utility";
import { initializedArray } from "phil-lib/misc";

class Sphere {
  /**
   * **TODO** fix this slightly out of date but not completely wrong documentation:
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
  static createHighlight(a: number, b: number) {
    if (a < 0 || a > 1 || !isFinite(a)) {
      throw new Error("wtf");
    }
    if (b < 0 || b > 1 || !isFinite(b)) {
      throw new Error("wtf");
    }
    /**
     * I was having trouble with numbers very close to 0.  SVG should be able to read scientific notation,
     * but I was seeing problems and I each time I fixed the problem by replacing something like "1.23456e-20"
     * with "0".  I haven't noticed this issue before.
     */
    const format = Intl.NumberFormat("en-US", {
      notation: "standard",
    }).format;

    const radius = 0.5;
    const top = `0,${-radius}`;
    const bottom = `0,${radius}`;
    const clockwise = "1";
    const counterclockwise = "0";
    const radiusA = Math.abs(a - radius);
    const directionA = a >= 0.5 ? clockwise : counterclockwise;
    const radiusB = Math.abs(b - radius);
    const directionB = b <= 0.5 ? clockwise : counterclockwise;
    const d = `M ${top} A ${format(
      radiusA
    )},${radius} 3.14159 0 ${directionA} ${bottom} A ${format(
      radiusB
    )},${radius} 3.14159 0 ${directionB} ${top}`;
    return d;
  }
  readonly #top = document.createElementNS("http://www.w3.org/2000/svg", "g");
  get top() {
    return this.#top;
  }
  readonly #orange = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  readonly #white = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  readonly #lightAndShadow = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  constructor() {
    this.#top.append(this.#orange, this.#white, this.#lightAndShadow);
    this.#top.classList.add("sphere");
  }
  #yAngle = 0;
  get yAngle() {
    return this.#yAngle;
  }
  /**
   * - 0 means the orange side is facing directly toward the user.
   * - π means the white side is facing directly toward the user.
   * - A very small positive number will show a very small sliver of white on the left.
   * - A number slightly below zero will show a very small sliver of white on the right.
   * - π / 2 will be half orange and half white, with the white on the left.
   * - 3 * π / 2 will be half orange and half white, with the white on the right.
   * - A fixed sized change in the input will cause the most obvious changes to the display when we are displaying half of each color.
   * - It will cause the least obvious changes when we are displaying mostly one color and very little of the other.
   */
  set yAngle(newValue) {
    const clampedAngle = positiveModulo(newValue, 2 * Math.PI);
    if (clampedAngle < Math.PI) {
      // The white part is on the left.
      /**
       * As clampedAngle moves from 0 to π, adjustedForSpeed moves from 0 to 1.
       * The function is not linear.
       */
      const right = (1 - Math.cos(clampedAngle)) / 2;
      this.updateWhite(0, right);
    } else {
      // The white part is on the right
      /**
       * As clampedAngle moves from π to 2π, adjustedForSpeed moves from 0 to 1.
       * The function is not linear.
       */
      const left = (1 + Math.cos(clampedAngle)) / 2;
      this.updateWhite(left, 1);
    }
  }
  #zAngle = 0;
  get zAngle() {
    return this.#zAngle;
  }
  set zAngle(newValue) {
    this.#white.style.transform = `rotate(${newValue}rad)`;
  }
  #x = 0;
  get x() {
    return this.#x;
  }
  set x(newValue) {
    this.#x = newValue;
    this.#top.style.setProperty("--x", newValue + "px");
  }
  #y = 0;
  get y() {
    return this.#y;
  }
  set y(newValue) {
    this.#y = newValue;
    this.#top.style.setProperty("--y", newValue + "px");
  }
  #diameter = 1;
  get diameter() {
    return this.#diameter;
  }
  set diameter(newValue) {
    this.#diameter = newValue;
    this.#top.style.setProperty("--diameter", newValue.toString());
  }
  updateWhite(a: number, b: number) {
    const d = Sphere.createHighlight(a, b);
    this.#white.setAttribute("d", d);
    return d; // for debugging, not production
  }
}

{
  const svg = getById("overview1", SVGSVGElement);
  const sphere = new Sphere();
  sphere.x = 0.5;
  sphere.y = 0.5;
  svg.appendChild(sphere.top);
}

async function overview2() {
  const svg = getById("overview2svg", SVGSVGElement);
  const sphere = new Sphere();
  sphere.x = 0.5;
  sphere.y = 0.5;
  sphere.yAngle = Math.PI / 2;
  svg.appendChild(sphere.top);
  const descriptionDiv = getById("overview2text", HTMLDivElement);
  descriptionDiv.innerText = "Orange side pointing to your right.";
}
overview2();

const testSvg = getById("test", SVGSVGElement);
const spheres = initializedArray(5, (index) => {
  const sphere = new Sphere();
  testSvg.appendChild(sphere.top);
  switch (index) {
    case 0: {
      sphere.diameter = 2;
      sphere.y = 2;
      sphere.x = 1;
      sphere.yAngle = Math.PI / 4;
      break;
    }
    case 1: {
      sphere.y = 1.5;
      sphere.x = 2.5;
      sphere.yAngle = Math.PI / 2;
      break;
    }
    case 2: {
      sphere.y = 2.5;
      sphere.x = 2.5;
      sphere.yAngle = (3 * Math.PI) / 2;
      break;
    }
    case 3: {
      sphere.y = 0.5;
      sphere.x = 3.5;
      break;
    }
    case 4: {
      sphere.y = 1.5;
      sphere.x = 3.5;
      break;
    }
    default: {
      throw new Error("wtf");
    }
  }
  return sphere;
});
(window as any).spheres = spheres;

function animateSoon() {
  requestAnimationFrame(animate);
}

function animate(timestamp: number) {
  animateSoon();
  spheres[0].zAngle = timestamp / 700;
  spheres[3].yAngle = timestamp / 831;
  spheres[4].zAngle = timestamp / 607;
  spheres[4].yAngle = timestamp / 501;
}

animateSoon();
// TODO fix these bugs:
// spheres[3].yAngle = timestamp / 831; shows a bug.
//   The animation jumps every time the diving line crosses over the half way point.
//   The animation is smooth at all other times.
// The white never properly covers the orange right.
//   It's fine where the orange and white are supposed to be touching.
//   But where the white is touching the background color, you always see a little orange poking free.
// Sometimes the crescent shape has some weird effects.
//   Notice the little green line just to the left of the top of the the green crescent.
//   And look at the two spheres below it.  A little white bit of the bottom sphere is covering the sphere immediately above it.
//     The previous line is no longer accurate.
//     I changed the circle with the problem, and I fixed a strange bug.
//     Either or both of those could be why I don't see this bug any more.
//   The two spheres which are rotating about the y axis show the same bug in a constantly changing way, sometime huge.
