
export type Point = { readonly x: number; readonly y: number };

export type Line = { x0: number; y0: number; slope: number };

/**
 * 
 * @param α 
 * @param β 
 * @returns 
 * @deprecated findIntersection() in path-shape.ts in random-svg-tests does this right.
 * https://github.com/TradeIdeasPhilip/random-svg-tests/blob/ac3c9f9087a7fb440d03374e720365b1973835cd/src/path-shape.ts#L1375
 * That file is still in works as is not ready for a library yet.
 */
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

