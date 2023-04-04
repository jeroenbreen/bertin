import { rounding } from "../helpers/rounding.js";

export function legthickness(selection, options = {}, delay, duration) {
  let x = options.x != undefined ? options.x : null;
  let y = options.y != undefined ? options.y : null;
  let valmax = options.valmax;
  let sizemax = options.sizemax;
  let title = options.title ? options.title : null;
  let fontSize = options.fontSize != undefined ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 != undefined ? options.fontSize2 : 10;
  let fill = options.fill ? options.fill : "black";
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let w = options.w != undefined ? options.w : 75;
  let round = options.round != undefined ? options.round : undefined;

  const span = 10;

  if (x != null && y != null) {
    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", "legthickness_" + options.id);

    if (duration != 0) {
      leg
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 1);
    }

    let delta = 0;
    if (title != null) {
      delta = (title.split("\n").length + 1) * fontSize;
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
    }

    leg
      .append("path")
      .attr(
        "d",
        `M ${x},${y + delta + sizemax / 2} ${x + w},${y + delta} ${x + w},${
          y + delta + sizemax
        } Z `
      )
      .attr("stroke", "none")
      .attr("fill", fill)
      .attr("fill-opacity", fillOpacity);

    leg
      .append("text")
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "hanging")
      .attr("x", x)
      .attr("y", y + delta + sizemax / 2 + fontSize2 / 2)
      .text("0");

    leg
      .append("text")
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "hanging")
      .attr("x", x + w)
      .attr("y", y + delta + sizemax + fontSize2 / 2)
      .text(rounding(valmax, round));
  }
}
