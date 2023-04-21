import { geolines as getlines } from "../helpers/geolines.js";
import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoPath });

export function geolines(selection, projection, planar, options = {}, clipid) {
  if (!planar) {
    let stroke = options.stroke != undefined ? options.stroke : "#020e21";
    if (!Array.isArray(stroke)) {
      stroke = Array(3).fill(stroke);
    }

    let strokeWidth =
      options.strokeWidth != undefined ? options.strokeWidth : [1.5, 1.2, 0.7];
    if (!Array.isArray(strokeWidth)) {
      strokeWidth = Array(3).fill(strokeWidth);
    }

    let strokeOpacity =
      options.strokeOpacity != undefined ? options.strokeOpacity : 1;
    if (!Array.isArray(strokeOpacity)) {
      strokeOpacity = Array(3).fill(strokeOpacity);
    }

    let strokeDasharray =
      options.strokeDasharray != undefined
        ? options.strokeDasharray
        : ["none", 5, 3];
    if (!Array.isArray(strokeDasharray)) {
      strokeDasharray = Array(3).fill(strokeDasharray);
    }

    let strokeLinecap =
      options.strokeLinecap != undefined ? options.strokeLinecap : "butt";
    if (!Array.isArray(strokeLinecap)) {
      strokeLinecap = Array(3).fill(strokeLinecap);
    }

    let lines = getlines().features;

    let l = selection
      .append("g")
      .attr("class", options.id)
      .attr("data-layer", JSON.stringify({ _type: "geolines" }));

    l.attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`);

    l.append("g")
      .selectAll("path")
      .data(lines.filter((d) => d.properties.name == "Equator"))
      .join("path")
      .attr("d", d3.geoPath(projection))
      .attr("class", "onglobe")
      .attr("fill", "none")
      .attr("stroke", stroke[0])
      .attr("stroke-width", strokeWidth[0])
      .attr("stroke-opacity", strokeOpacity[0])
      .attr("stroke-dasharray", strokeDasharray[0])
      .attr("stroke-linecap", strokeLinecap[0]);

    l.append("g")
      .selectAll("path")
      .data(lines.filter((d) => d.properties.name.includes("Tropic")))
      .join("path")
      .attr("d", d3.geoPath(projection))
      .attr("class", "onglobe")
      .attr("fill", "none")
      .attr("stroke", stroke[1])
      .attr("stroke-width", strokeWidth[1])
      .attr("stroke-opacity", strokeOpacity[1])
      .attr("stroke-dasharray", strokeDasharray[1])
      .attr("stroke-linecap", strokeLinecap[1]);

    l.append("g")
      .selectAll("path")
      .data(lines.filter((d) => d.properties.name.includes("Circle")))
      .join("path")
      .attr("d", d3.geoPath(projection))
      .attr("class", "onglobe")
      .attr("fill", "none")
      .attr("stroke", stroke[2])
      .attr("stroke-width", strokeWidth[2])
      .attr("stroke-opacity", strokeOpacity[2])
      .attr("stroke-dasharray", strokeDasharray[2])
      .attr("stroke-linecap", strokeLinecap[2]);
  }
}
