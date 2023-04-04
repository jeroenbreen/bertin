import { scaleSqrt } from "d3-scale";
import { max, descending } from "d3-array";
const d3 = Object.assign({}, { scaleSqrt, max, descending });
import { rounding } from "../helpers/rounding.js";

export function legsquares(
  selection,
  options = {},
  id,
  delay = 0,
  duration = 0
) {
  let values = options.values;
  let k = options.k ? options.k : 50;
  let stroke = options.stroke ? options.stroke : "black";
  let fill = options.fill ? options.fill : "none";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.8;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let title = options.title
    ? options.title
    : `Title, year
  (units)`;
  let fontSize = options.fontSize ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 ? options.fontSize2 : 10;
  let round = options.round != undefined ? options.round : undefined;
  let divisor = options.divisor != undefined ? options.divisor : 1;
  let fixmax = options.fixmax;

  const valvax = fixmax != undefined ? fixmax : d3.max(values);
  let size = d3.scaleSqrt([0, valvax], [0, k * 1.77]);

  let sizemax = size(d3.max(values));

  if (x != null && y != null) {
    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", "legsquare_" + id);

    if (duration != 0) {
      leg
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 1);
    }

    leg
      .selectAll("rect")
      .data(values.sort(d3.descending))
      .join("rect")
      .attr("width", (d) => size(d))
      .attr("height", (d) => size(d))
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr(
        "transform",
        (d) =>
          `translate(${x + sizemax - size(d)},${
            y - size(d) + sizemax + (title.split("\n").length + 1) * fontSize
          })`
      );

    leg
      .selectAll("line")
      .data(values)
      .join("line")
      .attr("x1", x + sizemax)
      .attr(
        "y1",
        (d) => y + sizemax - size(d) + (title.split("\n").length + 1) * fontSize
      )
      .attr("x2", x + sizemax + fontSize)
      .attr(
        "y2",
        (d) => y + sizemax - size(d) + (title.split("\n").length + 1) * fontSize
      )
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-dasharray", 2);

    leg
      .append("g")
      .selectAll("text")
      .data(title.split("\n"))
      .join("text")
      .attr("x", x)
      .attr("y", y)
      .attr("font-size", `${fontSize}px`)
      .attr("dy", (d, i) => i * fontSize)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "hanging")
      .attr("fill", txtcol)
      .text((d) => d);

    // Values

    leg
      .append("g")
      .selectAll("text")
      .data(values)
      .join("text")
      .attr("x", x + sizemax + fontSize + fontSize2 / 2)
      .attr(
        "y",
        (d) => y + sizemax - size(d) + (title.split("\n").length + 1) * fontSize
      )
      .attr("font-size", fontSize2)
      .attr("dominant-baseline", "central")
      .attr("fill", txtcol)
      .text((d) => rounding(d / divisor, round));
  }
}
