// TODO stop copying this and move it to phil-lib.

/**
 * ```
 * const randomValue = lerp(lowestLegalValue, HighestLegalValue, Math.random())
 * ```
 * @param at0 `lerp(at0, at1, 0)` → at0
 * @param at1 `lerp(at0, at1, 1)` → at1
 * @param where
 * @returns
 */
export function lerp(at0: number, at1: number, where: number) {
  return at0 + (at1 - at0) * where;
}

/**
 * This is similar to `numerator % denominator`, i.e. modulo division.
 * The difference is that the result will never be negative.
 * If the numerator is negative `%`  will return a negative number.
 *
 * If the 0 point is chosen arbitrarily then you should use `positiveModulo()` rather than `%`.
 * For example, C's `time_t` and JavaScript's `Date.prototype.valueOf()` say that 0 means midnight January 1, 1970.
 * Negative numbers refer to times before midnight January 1, 1970, and positive numbers refer to times after midnight January 1, 1970.
 * But midnight January 1, 1970 was chosen arbitrarily, and you probably don't want to treat times before that differently than times after that.
 * And how many people would even think to test a negative date?
 *
 * `positiveModulo(n, d)` will give the same result as `positiveModulo(n + d, d)` for all vales of `n` and `d`.
 * (You might get 0 sometimes and -0 other times, but those are both `==` so I'm not worried about that.)
 */
export function positiveModulo(numerator: number, denominator: number) {
  const simpleAnswer = numerator % denominator;
  if (simpleAnswer < 0) {
    return simpleAnswer + Math.abs(denominator);
  } else {
    return simpleAnswer;
  }
}

// Note that I modified this some after I copied it.
// I removed the initial call to onWake.
// That was causing some problems.
// Now onWake() is only called by Chrome, and the time parameter should always be right.
export class AnimationLoop {
  constructor(private readonly onWake: (time: DOMHighResTimeStamp) => void) {
    this.callback = this.callback.bind(this);
    // This next line isn't quite right.
    // Sometimes this timestamp is greater than the timestamp of the first requestAnimationFrame() callback.
    // TODO fix it.
    // this.callback(performance.now());
    requestAnimationFrame(this.callback);
  }
  #cancelled = false;
  cancel() {
    this.#cancelled = true;
  }
  private callback(time: DOMHighResTimeStamp) {
    if (!this.#cancelled) {
      requestAnimationFrame(this.callback);
      this.onWake(time);
    }
  }
}

// Copied from my curves repository.
// I haven't pushed that repository to github yet, and I'm not sure why!
// And I fixed something in this version.

export type Point = { readonly x: number; readonly y: number };

// TODO these should really be rays.  Two rays might not meet at all.
// If they do meet, findIntersection() will give the right answer.
// We need to know an angle, not a slope, to find that out.
//
// TODO if there is a problem matching the rays, we should draw a
// straight line, instead of skipping the segment or drawing some
// wild curves.  As learned from #SOME3.  Still skip the segment
// if an input is NaN.
export type Line = { x0: number; y0: number; slope: number };

export function findIntersection(α: Line, β: Line): Point | undefined {
  if (isNaN(α.slope) || isNaN(β.slope) || α.slope == β.slope) {
    return undefined;
  }
  const αIsVertical = α.slope == Infinity || α.slope == -Infinity;
  const βIsVertical = β.slope == Infinity || β.slope == -Infinity;
  if (αIsVertical && βIsVertical) {
    return undefined;
  }
  const x = αIsVertical
    ? α.x0
    : βIsVertical
    ? β.x0
    : (β.y0 - β.slope * β.x0 - α.y0 + α.slope * α.x0) / (α.slope - β.slope);
  const y = αIsVertical
    ? β.slope * (x - β.x0) + β.y0
    : α.slope * (x - α.x0) + α.y0;
  return { x, y };
}

// This is dead wrong in phil-lib/misc.ts!!!
export function polarToRectangular(r: number, θ: number) {
  return { x: Math.cos(θ) * r, y: Math.sin(θ) * r };
}
