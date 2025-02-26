import { getattr } from "../helpers/getattr.js";
import { tissot as ts } from "../helpers/tissot.js";
import { geoPath } from "d3-geo";

export function update_tissot({
  svg,
  projection,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);

  if (attr == "step") {
    node
      .selectAll("path")
      .datum(ts(value))
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("d", geoPath(projection));
  } else {
    node
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
