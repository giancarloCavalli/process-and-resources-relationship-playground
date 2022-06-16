import { Position } from "../../types/position";

export const getCurvedArrowPath = (fromPosition: Position, toPosition: Position, slackness: number, deviation: number): string => {  
  //https://www.beyondjava.net/how-to-connect-html-elements-with-an-arrow-using-svg
  //https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Higher-order_curves
  const x1 = fromPosition.left
  const y1 = fromPosition.top - 50 + deviation

  const x2 = toPosition.left + getConnectionAdjustmentInXAxis(x1, toPosition.left)
  const y2 = toPosition.top - 50 + deviation

  const delta = (x2 - x1) * slackness

  const hx1 = x1 + delta
  const hx2 = x2 - delta

  const hy1 = y1;
  const hy2 = y2;

  return `M ${x1} ${y1} C ${hx1} ${hy1} ${hx2} ${hy2} ${x2} ${y2}`
}

const getConnectionAdjustmentInXAxis = (xFrom: number, xTo: number): number => {
  return (xFrom - xTo >= 50 ? 70 : -15)
}