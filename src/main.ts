// This is the preferred way to include a css file.
import "./style.css";

import { getById } from "phil-lib/client-misc";
import {
  AnimationLoop,
  findIntersection,
  Point,
  positiveModulo,
  polarToRectangular,
  shuffleArray,
} from "./utility";
import {
  initializedArray,
  LinearFunction,
  makeBoundedLinear,
  makeLinear,
  sleep,
} from "phil-lib/misc";

/**
 * 180° (U-turn)
 */
const d180 = Math.PI;
/**
 * 360° (full circle)
 */
const d360 = 2 * d180;
/**
 * 90° (right angle)
 */
const d90 = d180 / 2;
/**
 * 45° (right angle)
 */
const d45 = d90 / 2;

function makeCircle(numberOfSegments: number) {
  if (numberOfSegments % 4 == 0) {
    // There's a weird bug.  If a segment is almost perfectly vertical, it causes problems.
    // TODO find and fix the bug.
    throw new Error("TODO");
  }
  const samples = initializedArray(numberOfSegments + 1, (index) => {
    const t = index / numberOfSegments;
    const θ = 3 * d90 - t * d360;
    const point: Point = polarToRectangular(0.5, θ);
    const direction = θ - d90;
    return { t, point, direction };
  });
  const segments = initializedArray(numberOfSegments, (index) => ({
    from: samples[index],
    to: samples[index + 1],
  }));
  let result = segments.map((segment) => {
    const controlPoint = findIntersection(
      {
        x0: segment.from.point.x,
        y0: segment.from.point.y,
        slope: Math.tan(segment.from.direction),
      },
      {
        x0: segment.to.point.x,
        y0: segment.to.point.y,
        slope: Math.tan(segment.to.direction),
      }
    );
    if (!controlPoint) {
      throw new Error("wtf");
    }
    return { controlPoint, segment };
  });
  return result;
}
const CIRCLE = makeCircle(10);
(window as any).CIRCLE = CIRCLE;

class Sphere {
  /**
   * I was having trouble with numbers very close to 0.  SVG should be able to read scientific notation,
   * but I was seeing problems and I each time I fixed the problem by replacing something like "1.23456e-20"
   * with "0".  I haven't noticed this issue before.
   */
  static readonly FORMAT = Intl.NumberFormat("en-US", {
    notation: "standard",
  }).format;
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
    const left = makeLinear(0, 1, 1, -1);
    const right = makeLinear(1, 1, 0, -1);
    return this.squashedCircle(left(a), right(b), "real");
  }
  /**
   * This draws a circle.  The left and right halves can be scaled separately.  The top and bottom points
   * of the circle are fixed.
   *
   * Examples:
   * - `Sphere.createHighlight(1,1)` will create a circle going counterclockwise.
   * - `Sphere.createHighlight(-1,-1)` will create a circle going clockwise.
   * - `Sphere.createHighlight(1,0)` will create the left half of circle going counterclockwise.
   * - `Sphere.createHighlight(0,1)` will create the right half of circle going counterclockwise.
   * - `Sphere.createHighlight(1,-0.5)` will create a crescent moon with the empty part on the right.
   * - `Sphere.createHighlight(-0.75,1)` will create an even thinner crescent moon with the empty part on the left.
   *
   * Originally I tried doing this with the `A` path command.  It worked most of the time.  If the width was
   * scaled to a value close to 0 I got weird results.  Exactly 0 worked, so I missed this in early testing.
   * @param downRatio If this is 1, the path will start with the left half of a circle going counterclockwise.
   * If this is 0.5 the left half of the circle will be squashed to have half the area.
   * 0 will cause the left half of the circle to be empty, and a vertical line to be displayed on the screen.
   * If this is negative, the down part will bow toward the right.
   * @param backRatio  If this is 1, the path will end with the right half of a circle going counterclockwise.
   * If this is 0.5 the right half of the circle will be squashed to have half the area.
   * 0 will cause the right half of the circle to be empty, and a vertical line to be displayed on the screen.
   * If this is negative, the up part will bow toward the left.
   * @param mode "real" to display the circle as expected in production.  The rest are various debug options.
   * @returns A valid value for the "d" attribute of a path.  (Add `path("` and `")` if you want to use this
   * in a css property.)
   */
  static squashedCircle(
    downRatio: number,
    backRatio: number,
    mode: "real" | "vertices" | "control points" | "control poly" | "vectors"
  ): string {
    const half = CIRCLE.length / 2;
    const instructions = CIRCLE.map(({ controlPoint, segment }, index) => {
      const ratio = index < half ? downRatio : backRatio;
      const control: Point = { x: controlPoint.x * ratio, y: controlPoint.y };
      const to = segment.to.point;
      const final: Point = { x: to.x * ratio, y: to.y };
      return { control, final };
    });
    const format = this.FORMAT;
    switch (mode) {
      case "real": {
        const start = instructions.at(-1)!.final;
        let result = `M ${format(start.x)}, ${format(start.y)} `;
        instructions.forEach((instruction) => {
          result += `Q ${format(instruction.control.x)},${format(
            instruction.control.y
          )} ${format(instruction.final.x)},${format(instruction.final.y)} `;
        });
        return result;
      }
      case "vertices": {
        let result = "";
        instructions.forEach((instruction) => {
          result += `M ${format(instruction.final.x)},${format(
            instruction.final.y
          )} L ${format(instruction.final.x)},${format(instruction.final.y)} `;
        });
        return result;
      }
      case "control points": {
        let result = "";
        instructions.forEach((instruction) => {
          result += `M ${format(instruction.control.x)},${format(
            instruction.control.y
          )} L ${format(instruction.control.x)},${format(
            instruction.control.y
          )} `;
        });
        return result;
      }
      case "control poly": {
        const start = instructions.at(-1)!.control;
        let result = `M ${format(start.x)}, ${format(start.y)} `;
        instructions.forEach((instruction) => {
          result += `L ${format(instruction.control.x)},${format(
            instruction.control.y
          )} `;
        });
        return result;
      }
      case "vectors": {
        const length = 0.2;
        let result = "";
        CIRCLE.forEach((instruction, _index) => {
          //if (index >= CIRCLE.length - 2) { return;}
          const { point, direction } = instruction.segment.to;
          const offset = polarToRectangular(length, direction);
          result += `M ${format(point.x)},${format(point.y)} L ${format(
            point.x + offset.x
          )},${format(point.y + offset.y)} `;
        });
        return result + this.squashedCircle(1, 1, "control points");
      }
      default: {
        throw new Error("wtf");
      }
    }
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
    const clampedAngle = positiveModulo(newValue, d360);
    if (clampedAngle < d180) {
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
  /**
   * This describes what the screen should look like between animations.
   *
   * An animation will require a `Settings` object for the starting state,
   * and a second for the ending state.
   */
  type Settings = {
    /**
     * This rotation is done first.
     */
    readonly yAngle: number;
    /**
     * This rotation is done second.
     *
     * If this is not specified, then it's a "don't care."
     * The animations can chose a value that looks good and/or is easy to implement.
     */
    readonly zAngle?: number;
    /**
     * HTML formatted.
     */
    readonly description: string;
  };
  type Opposites = readonly [Settings, Settings];
  type Actions = readonly Opposites[];
  // TODO some of these descriptions need some sort of arrow.
  // Using unicode characters caused small changes to the layout.
  // I might be able to make the font smaller for the troubling characters,
  // or I might draw arrows in a different way.
  // 🫵 👆 → ▶
  const actions: Actions = [
    [
      { description: "<u>toward you</u>", yAngle: 0 },
      { description: "<u>away</u> from you", yAngle: d180 },
    ],
    [
      {
        description: "<u>up</u> <canvas data-up-arrow></canvas>",
        yAngle: d90,
        zAngle: -d90,
      },
      {
        description: "<u>down</u> <canvas data-down-arrow></canvas>",
        yAngle: d90,
        zAngle: d90,
      },
    ],
    [
      {
        description: "to your <u>left</u> <canvas data-left-arrow></canvas>",
        yAngle: d90,
        zAngle: d180,
      },
      {
        description: "to your <u>right</u> <canvas data-right-arrow></canvas>",
        yAngle: d90,
        zAngle: 0,
      },
    ],
  ];
  const svg = getById("overview2svg", SVGSVGElement);
  const sphere = new Sphere();
  sphere.x = 0.5;
  sphere.y = 0.5;
  svg.appendChild(sphere.top);
  const descriptionDiv = getById("overview2text", HTMLDivElement);

  async function animateChange(from: Settings, to: Settings) {
    /**
     * If you change this, consider changing the time for the animation in style.css.
     * `#overview2text .fade-in { animation: fade-in 2s; }`
     */
    const durationMS = 2000;
    descriptionDiv.innerHTML = `The <span class="orange">orange</span> side is pointing <span class="fade-in">${to.description}</span>.`;
    const start = performance.now();
    const end = start + durationMS;
    const getYAngle = makeBoundedLinear(start, from.yAngle, end, to.yAngle);
    let getZAngle: LinearFunction | undefined;
    if (from.zAngle === undefined) {
      if (to.zAngle === undefined) {
        // Don't care -> don't care.  It might matter in the middle so pick something randomly.
        sphere.zAngle = Math.random() * d360;
      } else {
        // Don't care -> newZ.  Set newZ immediately.
        sphere.zAngle = to.zAngle;
      }
    } else {
      if (to.zAngle === undefined) {
        // Something -> don't care.  Nothing to do.
      } else {
        // Something -> something.
        getZAngle = makeBoundedLinear(start, from.zAngle, end, to.zAngle);
      }
    }
    const animationLoop = new AnimationLoop((timestamp) => {
      sphere.yAngle = getYAngle(timestamp);

      if (getZAngle) {
        sphere.zAngle = getZAngle(timestamp);
      }
    });
    // TODO this often goes the long way.  Make it always choose the shortest path.
    await sleep(durationMS);
    animationLoop.cancel();
    sphere.yAngle = to.yAngle;
    if (typeof to.zAngle == "number") {
      sphere.zAngle = to.zAngle;
    }
    await sleep(1000);
  }

  let previousSettings: Settings = { description: "", yAngle: 0 };
  while (true) {
    const performed = new Array<Settings>();
    for (const opposites of shuffleArray([...actions])) {
      const settings = opposites[(Math.random() * 2) | 0];
      await animateChange(previousSettings, settings);
      performed.push(settings);
      previousSettings = settings;
    }
    const recentYAngles = performed.map((settings) => settings.yAngle);
    const minYAngle = Math.min(...recentYAngles);
    const maxYAngle = Math.max(...recentYAngles);
    if (minYAngle == maxYAngle) {
      throw new Error("wtf");
    }
    const recentZAngles = performed.flatMap(({ zAngle }) =>
      typeof zAngle == "number" ? positiveModulo(zAngle, d360) : []
    );
    if (recentZAngles.length != 2) {
      throw new Error("wtf");
    }
    let minZAngle = Math.min(...recentZAngles);
    let maxZAngle = Math.max(...recentZAngles);
    let difference = maxZAngle - minZAngle;
    if (difference > d180) {
      [minZAngle, maxZAngle] = [maxZAngle, minZAngle + d360];
      difference = maxZAngle - minZAngle;
      if (difference > d180) {
        throw new Error("");
      }
    }
    // Add some padding so it doesn't say "right" or "up" or "toward" when it is very close to the line.
    // The padding makes sure it's never close to the line.
    function rangedPaddedRandom(min: number, max: number) {
      let distance = max - min;
      const padding = distance * 0.2;
      min += padding;
      max -= padding;
      distance = max - min;
      return Math.random() * distance + min;
    }
    // Similar to above but weighted to make it more visible.
    function weightedPaddedRandom(min: number, max: number) {
      //
      function paddingFor(angle: number) {
        return makeBoundedLinear(0, 0.2, d90, 0.4)(Math.abs(angle - d90));
      }
      let distance = max - min;
      min += paddingFor(min) * distance;
      max -= paddingFor(max) * distance;
      distance = max - min;
      const result = Math.random() * distance + min;
      return result;
    }
    const settings: Settings = {
      description: `<i>kinda</i> ${performed[0].description}, ${performed[1].description} and ${performed[2].description}`,
      yAngle: weightedPaddedRandom(minYAngle, maxYAngle),
      zAngle: rangedPaddedRandom(minZAngle, maxZAngle),
    };
    await animateChange(previousSettings, settings);
    previousSettings = settings;
  }
}
overview2();

async function overview3() {
  const svg = getById("overview3", SVGSVGElement);
  const trianglePath = getById("overview3triangle", SVGPathElement);
  const sphere = new Sphere();
  sphere.x = 0.5;
  sphere.y = 0.5;
  svg.appendChild(sphere.top);
  sphere.yAngle = d45;
  new AnimationLoop((time) => {
    const newAngle = positiveModulo(time / 480, d360);
    sphere.zAngle = newAngle;
    const color = newAngle > d90 && newAngle < 3 * d90 ? "white" : "#ff7d00";
    trianglePath.style.fill = color;
  });
}
overview3();

////////
// Temporary test stuff
////

const testSvg = getById("test", SVGSVGElement);
const spheres = initializedArray(5, (index) => {
  const sphere = new Sphere();
  testSvg.appendChild(sphere.top);
  switch (index) {
    case 0: {
      sphere.diameter = 2;
      sphere.y = 2;
      sphere.x = 1;
      sphere.yAngle = d45;
      break;
    }
    case 1: {
      sphere.y = 1.5;
      sphere.x = 2.5;
      sphere.yAngle = d90;
      break;
    }
    case 2: {
      sphere.y = 2.5;
      sphere.x = 2.5;
      sphere.yAngle = d90 + 0.01;
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

new AnimationLoop((timestamp) => {
  spheres[0].zAngle = timestamp / 700;
  spheres[3].yAngle = timestamp / 831;
  spheres[4].zAngle = timestamp / 607;
  spheres[4].yAngle = timestamp / 501;
});

{
  const fakeCirclePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  fakeCirclePath.setAttribute("d", Sphere.squashedCircle(1, 1, "real"));
  fakeCirclePath.style.transform = "translate(1.5px, 0.5px)";
  fakeCirclePath.style.fill = "orange";
  fakeCirclePath.style.strokeWidth = "0.1px";
  fakeCirclePath.style.stroke = "blue";
  fakeCirclePath.style.strokeLinecap = "round";
  testSvg.appendChild(fakeCirclePath);
}

{
  const fakeCirclePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  fakeCirclePath.setAttribute("d", Sphere.squashedCircle(-0.6667, 1, "real"));
  fakeCirclePath.style.transform = "translate(2.5px, 0.5px)";
  fakeCirclePath.style.fill = "lime";
  fakeCirclePath.style.strokeLinecap = "round";
  testSvg.appendChild(fakeCirclePath);
}

// TODO fix this:
// The white never properly covers the orange right.
//   It's fine where the orange and white are supposed to be touching.
//   But where the white is touching the background color, you always see a little orange poking free.
