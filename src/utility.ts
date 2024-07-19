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
