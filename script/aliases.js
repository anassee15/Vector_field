// @ts-nocheck

/**
 * display text on the canvas
 * @param {number[]} point point
 */
function legend(point) {
  const [x, y] = point;
  text([Math.round(x), Math.round(y)], x, y);
}

/**
 * draw vector on the canvas
 * @param {number[]} point1 point
 * @param {number[]} point2 point
 */
function vector(point1, point2) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  line(x1, y1, x2, y2);
}
