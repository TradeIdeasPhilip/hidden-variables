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
 * 45°
 */
const d45 = d90 / 2;

// VIDEO:
// This is a simpler version of my MathToPath code.
// https://github.com/TradeIdeasPhilip/random-svg-tests/blob/master/src/math-to-path.ts
// That deserves its own video.
// Usually I let MathToPath estimate a function's derivate.
// Because a circle is so simple, I can calculus it myself. 🤓
//
// I need to clean MathToPath up and put it in a library.
// It's very convenient.
/**
 * This function creates an _ideal_ circle.
 * Consider using the `CIRCLE` constant because there is only one _ideal_ circle.
 *
 * More documentation at `CIRCLE`
 * @param numberOfSegments How many quadratic Bézier segments to use to create the circle.
 * @returns A description of a set of Bézier segments appropriate for drawing a circle.
 */
function makeCircle(numberOfSegments: number) {
  if (numberOfSegments % 4 == 0) {
    // There's a weird bug.  If a segment is almost perfectly vertical, it causes problems.
    // TODO find and fix the bug.
    throw new Error("TODO");
  }
  /**
   * Record the position and derivative of the function at various times.
   */
  const samples = initializedArray(numberOfSegments + 1, (index) => {
    /**
     * The time associated with this sample.
     * A value between 0 and 1, inclusive.
     */
    const t = index / numberOfSegments;
    /**
     * The angle of the segment from the center of the circle to the current point.
     *
     * Note that the path starts at the top of the circle and makes one complete loop around.
     * It goes counterclockwise.
     *
     * Don't forget:  In math class, positive y means up.
     * In SVG, positive y means down.
     * Angles also have to be negated.
     */
    const θ = 3 * d90 - t * d360;
    const point: Point = polarToRectangular(0.5, θ);
    /**
     * The "derivative" of the function.
     * (It might be vertical.)
     */
    const direction = θ - d90;
    /**
     * The sample at time t.
     */
    return { t, point, direction };
  });
  /**
   * Each segment requires two samples, one for each end.
   * A circle is be smooth and continuous.
   * So the sample for the end of one segment is reused for the start of the next segment.
   */
  const segments = initializedArray(numberOfSegments, (index) => ({
    from: samples[index],
    to: samples[index + 1],
  }));
  const result = segments.map((segment) => {
    /**
     * This is the common way to specify a Bézier curve:
     * A single control point replaces two vectors.
     */
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
      // We actually have to deal with this for some shapes.
      // But a circle is too simple to fail.
      throw new Error("wtf");
    }
    return { controlPoint, segment };
  });
  return result;
}
// VIDEO:
// At one point I had to
/**
 * This is an approximation of a circle shape.
 *
 * SVG contains more direct ways to draw a circle or ellipse.
 * I find those cumbersome, especially in this application.
 *
 * This circle is always centered on the origin, 1 unit in diameter, and perfectly round.
 * All other circles and squashed circles are based on this archetype.
 */
const CIRCLE = makeCircle(10);
(window as any).CIRCLE = CIRCLE;

/**
 * This provides a way to display a sphere with one hemisphere one color and the other hemisphere another color.
 * This manipulates a number of SVG elements and properties to allow you to rotate the sphere into any position.
 */
class Sphere {
  randomizeDirection(): void {
    // TODO This should create a uniform distribution.  To match all of the text!!
    this.yAngle = Math.random() * d360 - d180;
    this.zAngle = Math.random() * d360 - d180;
  }
  async randomizeDirectionAndAnimate(durationMS: number) {
    const startTime = performance.now();
    const endTime = startTime + durationMS;
    const values = (["yAngle", "zAngle"] as const).map((property) => {
      const previousAngle = this[property];
      const extraRotations = ((Math.random() * 5) | 0) - 2;
      const newAngle = Math.random() * d360 - d180;
      const newAnimatedAngle = newAngle + extraRotations * d360;
      const getAngle = makeBoundedLinear(
        startTime,
        previousAngle,
        endTime,
        newAnimatedAngle
      );
      const animationLoop = new AnimationLoop((timestamp) => {
        this[property] = getAngle(timestamp);
      });
      return { property, animationLoop, newAngle };
    });
    await sleep(durationMS);
    values.forEach(({ property, animationLoop, newAngle }) => {
      animationLoop.cancel();
      this[property] = newAngle;
    });
  }
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
    /**
     * How much to squash the left part of the circle.
     * The input is 0 to 1, as described below.
     *
     * `left` is a ratio which says how much to squash the left side of our ideal circle.
     * 1 means leave it alone.
     * 0 means flatten it into a vertical line segment through the origin.
     * -1 means to flip it across the y-axis to look like the right side of an ideal circle.
     */
    const left = makeLinear(0, 1, 1, -1);
    /**
     * How much to squash the right part of the circle.
     * The input is 0 to 1, as described below.
     *
     * `right` is a ratio which says how much to squash the right side of our ideal circle.
     * 1 means leave it alone.
     * 0 means flatten it into a vertical line segment through the origin.
     * -1 means to flip it across the y-axis to look like the left side of an ideal circle.
     */
    const right = makeLinear(1, 1, 0, -1);
    return this.squashedCircle(left(a), right(b), "real");
  }
  // VIDEO:
  // This is the heart of the rotation around the y-axis.
  // Notice the documentation comment about `A`.
  // Notice the "real" code that spits out SVG
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
  /**
   * The top level element.  Place this element on the SVG to display this sphere.
   */
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
  get listener(): SVGElement {
    return this.#lightAndShadow;
  }
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
    this.#yAngle = newValue;
    this.updateDetectors(...this.#detectors);
  }
  #zAngle = 0;
  get zAngle() {
    return this.#zAngle;
  }
  /**
   * This transformation is done _after_ the `yAngle`.
   * This does nothing noticeable if `yAngle` in an integer multiple of π.
   *
   * This is in radians.
   * This uses the SVG convention, not what you learned in algebra and trig
   * classes, so positive values are clockwise.
   */
  set zAngle(newValue) {
    this.#white.style.transform = `rotate(${newValue}rad)`;
    this.#zAngle = newValue;
    this.updateDetectors(...this.#detectors);
  }
  #x = 0;
  /**
   * The center of the sphere.
   * Defaults to 0.
   */
  get x() {
    return this.#x;
  }
  set x(newValue) {
    this.#x = newValue;
    this.#top.style.setProperty("--x", newValue + "px");
  }
  #y = 0;
  /**
   * The center of the sphere.
   * Defaults to 0.
   */
  get y() {
    return this.#y;
  }
  set y(newValue) {
    this.#y = newValue;
    this.#top.style.setProperty("--y", newValue + "px");
  }
  #diameter = 1;
  /**
   * Defaults to 1.
   */
  get diameter() {
    return this.#diameter;
  }
  set diameter(newValue) {
    this.#diameter = newValue;
    this.#top.style.setProperty("--diameter", newValue.toString());
  }
  /**
   * This allows you to set the left and right sides of the white area to anything you want.
   *
   * In normal operations you should set `this.y` which will call this.
   * @param a Where to draw the down stroke
   * @param b Where to draw the return stroke.
   * @returns Debug info.  Likely to change in the future.
   * This is the SVG path string.
   */
  private updateWhite(a: number, b: number) {
    const d = Sphere.createHighlight(a, b);
    this.#white.setAttribute("d", d);
    return d; // for debugging, not production
  }
  readonly #detectors: Detector[] = [];
  /**
   *
   * @param initialDirection In radians.
   */
  addDetector(initialDirection: number = 0): {
    direction: number;
    readonly orange: boolean;
  } {
    const detector = new Detector(this.top);
    this.#detectors.push(detector);
    detector.direction = initialDirection;
    const updateDetectors = this.updateDetectors.bind(this);
    updateDetectors(detector);
    const accessor = {
      get direction() {
        return detector.direction;
      },
      set direction(newValue) {
        detector.direction = newValue;
        updateDetectors(detector);
      },
      get orange() {
        return detector.orange;
      },
    };
    return accessor;
  }
  private updateDetectors(...detectors: Detector[]) {
    if (detectors.length > 0) {
      const flipped = positiveModulo(this.#yAngle, d360) > d180;
      const orangeStart = positiveModulo(
        this.#zAngle + (flipped ? d180 : 0),
        d360
      );
      detectors.forEach((detector) => {
        const position = positiveModulo(  orangeStart-detector.direction +d90, d360);
        const resultIsOrange = position < d180;
        detector.orange = resultIsOrange;
      });
    }
  }
}

class Detector {
  readonly #top = document.createElementNS("http://www.w3.org/2000/svg", "g");
  readonly #circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  constructor(parent: SVGGElement) {
    const arrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    const circle = this.#circle;
    this.#top.append(arrow, circle);
    parent.appendChild(this.#top);
    arrow.setAttribute(
      "points",
      "0.5 0,  0.6 -0.06,  0.6 -0.02,  0.77 -0.02,  0.77 0.02,  0.6 0.02,  0.6 0.06"
    );
    circle.style.strokeWidth = "0.03";
    circle.style.stroke = "black";
    circle.style.fill = "";
    circle.cx.baseVal.value = 0.77;
    circle.cy.baseVal.value = 0;
    circle.r.baseVal.value = 0.07;
  }
  #orange = true;
  get orange() {
    return this.#orange;
  }
  set orange(newValue: boolean) {
    this.#circle.style.fill = newValue ? "#ff7d00" : "white";
  }
  #direction = 0;
  get direction() {
    return this.#direction;
  }
  /**
   * Radians.
   */
  set direction(newValue: number) {
    this.#direction = newValue;
    this.#top.style.transform = `rotate(${Sphere.FORMAT(newValue)}rad)`;
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
  /**
   * Either go up or down.  Either go left or right.  Either go forward or back.
   */
  type Opposites = readonly [Settings, Settings];
  /**
   * These are the 6 cardinal directions.
   */
  type Actions = readonly Opposites[];
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

  /**
   * This is the value between iterations of this loop.
   */
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

async function randomizeSphereWithTwoDetectors() {
  const sphere = new Sphere();
  sphere.x = 1.5;
  sphere.y = 3.5;
  testSvg.appendChild(sphere.top);
  sphere.addDetector();
  const movableArrow = sphere.addDetector(Math.PI);
  sphere.listener.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const bounds = sphere.listener.getBoundingClientRect();
    const position = ((x - bounds.left) / bounds.width) * 2 - 1;
    const angle = Math.acos(Math.min(1, Math.max(-1, position)));
    movableArrow.direction = angle;
  });
  while (true) {
    await sphere.randomizeDirectionAndAnimate(750);
    await sleep(1667);
  }
}
randomizeSphereWithTwoDetectors();

// TODO fix this:
// The white never properly covers the orange right.
//   It's fine where the orange and white are supposed to be touching.
//   But where the white is touching the background color, you always see a little orange poking free.
