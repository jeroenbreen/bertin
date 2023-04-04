import { scaleSqrt } from "d3-scale";
import { max, descending } from "d3-array";
const d3 = Object.assign({}, { scaleSqrt, max, descending });
import { rounding } from "../helpers/rounding.js";

export function legcircles(
  selection,
  id,
  options = {},
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
  let radius = d3.scaleSqrt([0, valvax], [0, k]);

  let rmax = radius(d3.max(values));

  if (x != null && y != null) {
    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", "legcircle_" + id);

    if (duration != 0) {
      leg
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 1);
    }

    leg
      .selectAll("circle")
      .data(values.sort(d3.descending))
      .join("circle")
      .attr("r", (d) => radius(d))
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr(
        "transform",
        (d) =>
          `translate(${x + rmax},${
            y - radius(d) + rmax * 2 + (title.split("\n").length + 1) * fontSize
          })`
      );

    leg
      .selectAll("line")
      .data(values)
      .join("line")
      .attr("x1", x + rmax)
      .attr(
        "y1",
        (d) =>
          y +
          rmax * 2 -
          radius(d) * 2 +
          (title.split("\n").length + 1) * fontSize
      )
      .attr("x2", x + rmax * 2 + fontSize)
      .attr(
        "y2",
        (d) =>
          y +
          rmax * 2 -
          radius(d) * 2 +
          (title.split("\n").length + 1) * fontSize
      )
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-dasharray", 2);

    // Legend title

    // leg
    //   .append("circle")
    //   .attr("cx", x)
    //   .attr("cy", y)
    //   .attr("r", 4)
    //   .attr("fill", "red");

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
      .attr("x", x + rmax * 2 + fontSize + fontSize2 / 2)
      .attr(
        "y",
        (d) =>
          y +
          rmax * 2 -
          radius(d) * 2 +
          (title.split("\n").length + 1) * fontSize
      )
      .attr("font-size", fontSize2)
      .attr("dominant-baseline", "central")
      .attr("fill", txtcol)
      .text((d) => rounding(d / divisor, round));
  }
}
