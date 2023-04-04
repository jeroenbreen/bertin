// Imports
import { geoMercator } from "d3-geo";
import { create } from "d3-selection";
import { geoPath } from "d3-geo";
import { transition } from "d3-transition";
const d3 = Object.assign({}, { geoMercator, create, geoPath, transition });

// Helpers
import { getheight } from "./helpers/height.js";
import { bbox } from "./bbox.js";
import { getproj } from "./projections/projections.js";
import { geoimport } from "./helpers/geoimport.js";

// Update
import { update_main } from "./update/update-main.js";

// Layers
import { graticule } from "./layers/graticule.js";
import { geolines } from "./layers/geolines.js";
import { outline } from "./layers/outline.js";
import { addfooter } from "./layers/footer.js";
import { addheader } from "./layers/header.js";
import { simple } from "./layers/simple.js";
import { bubble } from "./layers/bubble.js";
import { square } from "./layers/square.js";
import { regularbubble } from "./layers/regularbubble.js";
import { regularsquare } from "./layers/regularsquare.js";
import { ridge } from "./layers/ridge.js";
import { path } from "./layers/path.js";
import { regulargrid } from "./layers/regulargrid.js";
import { smooth } from "./layers/smooth.js";
import { mushroom } from "./layers/mushroom.js";
import { missing } from "./layers/missing.js";
import { shadow } from "./layers/shadow.js";
import { waterlines } from "./layers/waterlines.js";
import { inner } from "./layers/inner.js";
import { scalebar } from "./layers/scalebar.js";
import { text } from "./layers/text.js";
import { label } from "./layers/label.js";
import { spikes } from "./layers/spikes.js";
import { dotcartogram } from "./layers/dotcartogram.js";
import { hatch } from "./layers/hatch.js";
import { dotdensity } from "./layers/dotdensity.js";
import { tiles } from "./layers/tiles.js";
import { logo } from "./layers/logo.js";
import { rhumbs } from "./layers/rhumbs.js";
import { tissot } from "./layers/tissot.js";
import { minimap } from "./layers/minimap.js";

// Main
export function draw({ params = {}, layers = {} } = {}) {
  // projections
  let planar = params.projection == "user" ? true : false;
  let projection = params.projection;
  let height = params.height;
  let reverse = params.reverse ? false : true;
  const types = layers.map((d) => d.type);
  if (types.includes("tiles")) {
    projection = d3.geoMercator();
  } else {
    projection = getproj(projection);
  }

  // geoimport & rewind

  layers.forEach((d) => {
    if (d["geojson"] !== undefined) {
      d["geojson"] = geoimport(d["geojson"], { rewind: d["rewind"] });
    }
  });

  // extent
  let width = params.width ? params.width : 1000;
  let extent = params.extent ? params.extent : null;
  extent =
    Array.isArray(extent) &&
    Array.isArray(extent[0]) &&
    Array.isArray(extent[1])
      ? bbox(extent)
      : extent;

  // other global parameters
  let margin = params.margin ? params.margin : 1;
  if (!Array.isArray(margin)) {
    margin = [margin, margin, margin, margin];
  }

  let background = params.background;
  let clip = params.clip == true ? true : false;

  // optimal heights

  let myheight = getheight(layers, extent, margin, projection, planar, width);

  height = height == undefined ? myheight.height : height;
  let headerdelta = 0;
  let header = layers.find((d) => d.type == "header");
  if (header) {
    if (header.text) {
      headerdelta = 25 * header.text.split("\n").length + 10;
    }
    if (header.fontSize) {
      headerdelta = header.fontSize * header.text.split("\n").length + 10;
    }
  }
  let footerdelta = 0;
  let footer = layers.find((d) => d.type == "footer");
  if (footer) {
    if (footer.text) {
      footerdelta = 10 * footer.text.split("\n").length + 10;
    }
    if (footer.fontSize) {
      footerdelta = footer.fontSize * footer.text.split("\n").length + 10;
    }
  }

  // svg document
  const svg = d3
    .create("svg")
    .attr("id", "bertinmap")
    .attr("width", width)
    .attr("height", height + headerdelta + footerdelta)
    .attr("viewBox", [
      0,
      -headerdelta,
      width,
      height + headerdelta + footerdelta,
    ])
    .attr(
      "style",
      `max-width: 100%; height: auto; height: intrinsic; background-color: white;`
    );

  // defs
  let defs = svg.append("defs");

  // font
  defs
    .append("style")
    .attr("type", "text/css")
    .text(
      "@import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Roboto&family=Rubik&family=Ubuntu&display=swap');"
    );

  // Clip
  let clipid = null;
  if (clip) {
    // test
    clipid = Date.now().toString(36) + Math.random().toString(36).substring(2);
    svg
      .append("clipPath")
      .attr("id", `clip_${clipid}`)
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", d3.geoPath(projection));
  } // test

  // Background color
  if (background) {
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", background);
  }

  // Outline (fill)
  let o = layers.find((d) => d.type == "outline");
  if (o) {
    outline(svg, projection, planar, {
      display: o.display,
      fill: o.fill,
      fillOpacity: o.fillOpacity,
      stroke: "none",
      strokeWidth: "none",
    });
  }

  // ----------------------------------------

  let l = reverse ? [...layers].reverse() : [...layers];

  l.forEach((layer) => {
    // graticule

    if (layer.type == "graticule") {
      graticule(
        svg,
        projection,
        planar,
        {
          display: layer.display,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          step: layer.step,
          spread: layer.spread,
        },
        clipid,
        myheight.bbox
      );
    }

    // geolines
    if (layer.type == "geolines") {
      geolines(
        svg,
        projection,
        planar,
        {
          display: layer.display,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeLinecap: layer.strokeLinecap,
        },
        clipid
      );
    }

    // minimap
    if (layer.type == "minimap" || layer.type == "location") {
      minimap({
        x: layer.x,
        y: layer.y,
        width: layer.width,
        projection: layer.projection,
        geojson: layer.geojson,
        rewind: layer.rewind,
        extent: layer.extent,
        threshold: layer.threshold,
        background: layer.background,
        geometries: layer.geometries,
        raise: layer.raise,
        frame: layer.frame,
        dot: layer.dot,
        mainmap: {
          selection: svg,
          projection: projection,
          width: width,
          height: height,
        },
      });
    }

    // tiles

    if (layer.type == "tiles") {
      tiles(svg, width, height, projection, {
        display: layer.display,
        opacity: layer.opacity,
        tileSize: layer.tileSize,
        zoomDelta: layer.zoomDelta,
        style: layer.style,
        clip: layer.clip,
        increasetilesize: layer.increasetilesize,
        source: layer.source,
      });
    }

    // simple layers
    if (
      layer.type == "layer" ||
      layer.type == "simple" ||
      layer.type == undefined
    ) {
      simple(
        svg,
        projection,
        {
          id: layer.id,
          geojson: layer.geojson,
          rewind: layer.rewind,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          fillOpacity: layer.fillOpacity,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
          symbol: layer.symbol,
          symbol_size: layer.symbol_size,
          symbol_iteration: layer.symbol_iteration,
          symbol_shift: layer.symbol_shift,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_w: layer.leg_w,
          leg_h: layer.leg_h,
          leg_title: layer.leg_title,
          leg_text: layer.leg_text,
          leg_type: layer.leg_type,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_stroke: layer.leg_stroke,
          leg_fillOpacity: layer.leg_fillOpacity,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // dot density

    if (layer.type == "dotdensity") {
      dotdensity(
        svg,
        projection,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          dotvalue: layer.dotvalue,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          fillOpacity: layer.fillOpacity,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
          symbol: layer.symbol,
          symbol_size: layer.symbol_size,
          symbol_iteration: layer.symbol_iteration,
          symbol_shift: layer.symbol_shift,
          tooltip: layer.tooltip,
          leg_type: layer.leg_type,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_w: layer.leg_w,
          leg_h: layer.leg_h,
          leg_title: layer.leg_title,
          leg_text: layer.leg_text,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_stroke: layer.leg_stroke,
          leg_fillOpacity: layer.leg_fillOpacity,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
        },
        clipid,
        width,
        height
      );
    }

    // spikes layers

    if (layer.type == "spikes") {
      spikes(
        svg,
        projection,
        planar,
        {
          id: layer.id,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          k: layer.k,
          w: layer.w,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_w: layer.leg_w,
          leg_h: layer.leg_h,
          leg_title: layer.leg_title,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_stroke: layer.leg_stroke,
          leg_fill: layer.leg_fill,
          leg_fillOpacity: layer.leg_fillOpacity,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          leg_round: layer.leg_round,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // mushroom layer

    if (layer.type == "mushroom") {
      mushroom(
        svg,
        projection,
        planar,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          top_values: layer.top_values,
          bottom_values: layer.bottom_values,
          top_fill: layer.top_fill,
          bottom_fill: layer.bottom_fill,
          k: layer.k,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeOpacity: layer.strokeOpacity,
          top_tooltip: layer.top_tooltip,
          bottom_tooltip: layer.bottom_tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_round: layer.leg_round,
          leg_txtcol: layer.leg_txtcol,
          leg_title: layer.leg_title,
          leg_top_txt: layer.leg_top_txt,
          leg_bottom_txt: layer.leg_bottom_txt,
          leg_top_fill: layer.leg_top_fill,
          leg_bottom_fill: layer.leg_bottom_fill,
          leg_stroke: layer.leg_stroke,
          leg_strokeWidth: layer.leg_strokeWidth,
          viewof: layer.viewof,
        },
        width,
        height
      );
    }

    // labels layer

    if (layer.type == "label") {
      label(
        svg,
        projection,
        planar,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          fill: layer.fill,
          fontSize: layer.fontSize,
          fontFamily: layer.fontFamily,
          textDecoration: layer.textDecoration,
          fontWeight: layer.fontWeight,
          fontStyle: layer.fontStyle,
          opacity: layer.opacity,
          halo: layer.halo,
          halo_style: layer.halo_style,
        },
        clipid
      );
    }

    // text note
    if (layer.type == "text") {
      text(svg, width, height, {
        display: layer.display,
        position: layer.position,
        text: layer.text,
        fill: layer.fill,
        stroke: layer.stroke,
        fontSize: layer.fontSize,
        fontFamily: layer.fontFamily,
        textDecoration: layer.textDecoration,
        fontWeight: layer.fontWeight,
        fontStyle: layer.fontStyle,
        margin: layer.margin,
        anchor: layer.anchor, // start, middle, end
        baseline: layer.baseline, // baseline, middle, hanging
        frame_fill: layer.frame_fill,
        frame_stroke: layer.frame_stroke,
        frame_opacity: layer.frame_opacity,
        frame_strokeWidth: layer.frame_strokeWidth,
      });
    }

    // logo
    if (layer.type == "logo") {
      logo(svg, width, height, {
        display: layer.display,
        url: layer.url,
        size: layer.size,
        position: layer.position,
      });
    }

    // missing
    if (layer.type == "missing") {
      missing(
        svg,
        projection,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_w: layer.leg_w,
          leg_h: layer.leg_h,
          leg_text: layer.leg_text,
          leg_fontSize: layer.leg_fontSize,
          leg_stroke: layer.leg_stroke,
          leg_fillOpacity: layer.fillOpacity,
          leg_fill: layer.fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
        },
        clipid
      );
    }

    // shadow
    if (layer.type == "shadow") {
      shadow(svg, projection, clipid, {
        display: layer.display,
        geojson: layer.geojson,
        rewind: layer.rewind,
        fill: layer.fill,
        dx: layer.dx,
        dy: layer.dy,
        opacity: layer.opacity,
        stdDeviation: layer.stdDeviation,
      });
    }

    // water lines

    if (layer.type == "waterlines") {
      waterlines(svg, projection, layer.geojson, clipid, {
        display: layer.display,
        stroke: layer.stroke,
        dist: layer.dist,
        unit: layer.unit,
        nb: layer.nb,
        precision: layer.precision,
        strokeOpacity: layer.strokeOpacity,
        strokeWidth: layer.strokeWidth,
        stroke: layer.stroke,
        strokeDasharray: layer.strokeDasharray,
        strokeLinecap: layer.strokeLinecap,
        strokeLinejoin: layer.strokeLinejoin,
      });
    }

    // inner
    if (layer.type == "inner") {
      inner(svg, projection, {
        display: layer.display,
        geojson: layer.geojson,
        rewind: layer.rewind,
        fill: layer.fill,
        fillOpacity: layer.fillOpacity,
        blur: layer.blur,
        thickness: layer.thickness,
      });
    }

    // rhumbs

    if (layer.type == "rhumbs") {
      rhumbs(svg, width, height, clipid, {
        visibility: layer.visibility,
        id: layer.id,
        nb: layer.nb,
        position: layer.position,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        strokeOpacity: layer.strokeOpacity,
        strokeDasharray: layer.strokeDasharray,
      });
    }

    // tissot

    if (layer.type == "tissot") {
      tissot(
        svg,
        projection,
        planar,
        {
          id: layer.id,
          visibility: layer.visibility,
          step: layer.step,
          fill: layer.fill,
          fillOpacity: layer.fillOpacity,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeOpacity: layer.strokeOpacity,
        },
        clipid
      );
    }

    // Dots cartogram

    if (layer.type == "dotcartogram") {
      dotcartogram(
        svg,
        projection,
        planar,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          radius: layer.radius,
          nbmax: layer.nbmax,
          onedot: layer.onedot,
          span: layer.span,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          iteration: layer.iteration,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_title: layer.leg_title,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_txtcol: layer.leg_txtcol,
          leg_stroke: layer.leg_stroke,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_fill: layer.leg_fill,
          leg_txt: layer.leg_txt,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // Bubbles

    if (layer.type == "bubble") {
      bubble(
        svg,
        projection,
        planar,
        {
          id: layer.id,
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          planar: layer.planar,
          k: layer.k,
          fixmax: layer.fixmax,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          dorling: layer.dorling,
          iteration: layer.iteration,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_stroke: layer.leg_stroke,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          leg_title: layer.leg_title,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_round: layer.leg_round,
          leg_divisor: layer.leg_divisor,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // Squares

    if (layer.type == "square") {
      square(
        svg,
        projection,
        planar,
        {
          id: layer.id,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          planar: layer.planar,
          k: layer.k,
          fixmax: layer.fixmax,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          dorling: layer.dorling,
          demers: layer.demers,
          iteration: layer.iteration,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_stroke: layer.leg_stroke,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          leg_title: layer.leg_title,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_round: layer.leg_round,
          leg_divisor: layer.leg_divisor,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // Points Bertin

    if (layer.type == "regularbubble") {
      regularbubble(
        svg,
        projection,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          step: layer.step,
          blur: layer.blur,
          geoprocessing: layer.geoprocessing,
          operator: layer.operator,
          planar: layer.planar,
          k: layer.k,
          fixmax: layer.fixmax,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          dorling: layer.dorling,
          iteration: layer.iteration,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_stroke: layer.leg_stroke,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          leg_title: layer.leg_title,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_round: layer.leg_round,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // ridge

    if (layer.type == "ridge") {
      ridge(
        svg,
        projection,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          step: layer.step,
          blur: layer.blur,
          k: layer.k,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          operator: layer.operator,
          geoprocessing: layer.geoprocessing,
        },
        clipid,
        width,
        height
      );
    }

    // Points Bertin (carrés)

    if (layer.type == "regularsquare") {
      regularsquare(
        svg,
        projection,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          step: layer.step,
          blur: layer.blur,
          geoprocessing: layer.geoprocessing,
          operator: layer.operator,
          planar: layer.planar,
          k: layer.k,
          fixmax: layer.fixmax,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          fillOpacity: layer.fillOpacity,
          strokeDasharray: layer.strokeDasharray,
          strokeOpacity: layer.strokeOpacity,
          dorling: layer.dorling,
          demers: layer.demers,
          iteration: layer.iteration,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_stroke: layer.leg_stroke,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          leg_title: layer.leg_title,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_round: layer.leg_round,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // Regular grid
    if (layer.type == "regulargrid" || layer.type == "grid") {
      regulargrid(
        svg,
        projection,
        {
          display: layer.display,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          step: layer.step,
          blur: layer.blur,
          geoprocessing: layer.geoprocessing,
          operator: layer.operator,
          planar: layer.planar,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          fillOpacity: layer.fillOpacity,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
          symbol: layer.symbol,
          symbol_size: layer.symbol_size,
          symbol_iteration: layer.symbol_iteration,
          symbol_shift: layer.symbol_shift,
          tooltip: layer.tooltip,
          leg_x: layer.leg_x,
          leg_y: layer.leg_y,
          leg_w: layer.leg_w,
          leg_h: layer.leg_h,
          leg_title: layer.leg_title,
          leg_text: layer.leg_text,
          leg_type: layer.leg_type,
          leg_fontSize: layer.leg_fontSize,
          leg_fontSize2: layer.leg_fontSize2,
          leg_stroke: layer.leg_stroke,
          leg_fillOpacity: layer.leg_fillOpacity,
          leg_fill: layer.leg_fill,
          leg_strokeWidth: layer.leg_strokeWidth,
          leg_txtcol: layer.leg_txtcol,
          viewof: layer.viewof,
        },
        clipid,
        width,
        height
      );
    }

    // Smooth
    if (
      layer.type == "smooth" ||
      layer.type == "contour" ||
      layer.type == "heatmap"
    ) {
      smooth(
        svg,
        projection,
        {
          display: layer.display,
          clip: layer.clip,
          geojson: layer.geojson,
          rewind: layer.rewind,
          values: layer.values,
          grid_step: layer.grid_step,
          grid_blur: layer.grid_blur,
          grid_operator: layer.grid_operator,
          grid_geoprocessing: layer.grid_geoprocessing,
          remove: layer.remove,
          fill: layer.fill,
          reverse: layer.reverse,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          fillOpacity: layer.fillOpacity,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
          thresholds: layer.thresholds,
          bandwidth: layer.bandwidth,
          cellsize: layer.cellsize,
          colorcurve: layer.colorcurve,
        },
        clipid,
        width,
        height
      );
    }

    // Custom

    if (layer.type == "custom" || layer.type == "function") {
      const { render, type, ...restOfLayer } = layer;
      if (typeof draw === "function") {
        let map = { projection, width, height, clipid };
        render(svg, map, {
          ...restOfLayer,
        });
      } else {
        console.warn(`'render' function missing for layer type: ${layer.type}`);
      }
    }

    // Header
    if (layer.type == "header") {
      addheader(svg, width, {
        display: layer.display,
        fontSize: layer.fontSize,
        text: layer.text,
        fill: layer.fill,
        background: layer.background,
        backgroundOpacity: layer.backgroundOpacity,
        anchor: layer.anchor,
      });
    }

    // Footer
    if (layer.type == "footer") {
      addfooter(svg, width, height, {
        display: layer.display,
        fontSize: layer.fontSize,
        text: layer.text,
        fill: layer.fill,
        background: layer.background,
        backgroundOpacity: layer.backgroundOpacity,
        anchor: layer.anchor,
      });
    }

    // Hatch
    if (layer.type == "hatch" || layer.type == "hatching") {
      hatch(
        svg,
        {
          id: layer.id,
          visibility: layer.visibility,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeOpacity: layer.strokeOpacity,
          angle: layer.angle,
          spacing: layer.spacing,
          strokeDasharray: layer.strokeDasharray,
        },
        width,
        height
      );
    }

    // Path

    if (layer.type == "path") {
      path(
        svg,
        width,
        height,
        {
          display: layer.display,
          d: layer.d,
          x: layer.x,
          y: layer.y,
          rotate: layer.rotate,
          margin: layer.margin,
          style: layer.style,
          scale: layer.scale,
          fill: layer.fill,
          stroke: layer.stroke,
          strokeWidth: layer.strokeWidth,
          strokeLinecap: layer.strokeLinecap,
          strokeLinejoin: layer.strokeLinejoin,
          fillOpacity: layer.fillOpacity,
          strokeOpacity: layer.strokeOpacity,
          strokeDasharray: layer.strokeDasharray,
        },
        clipid
      );
    }
  });

  // -----------------------------------------

  // Scalebar
  let s = layers.find((d) => d.type == "scalebar");
  if (s) {
    scalebar(svg, projection, planar, width, height, {
      display: s.display,
      x: s.x,
      y: s.y,
      units: s.units,
    });
  }

  // Outline (stroke)
  if (o) {
    outline(svg, projection, planar, {
      display: o.display,
      fill: "none",
      stroke: o.stroke,
      strokeWidth: o.strokeWidth,
    });
  }

  // Tootltip
  svg.append("g").attr("id", "info").attr("class", "info");

  // Raise legends
  svg.selectAll(".bertinlegend").raise();

  // Update

  //svg.node().update = update;

  // Viewof coordinates

  if (typeof layers.find((d) => d.viewof) == "undefined") {
    let coords = [];
    svg.on("mousemove", function (ev) {
      const { offsetX, offsetY } = ev;
      coords = projection.invert([offsetX, offsetY]);
      svg.dispatch("input");
    });

    Object.defineProperty(svg.node(), "value", {
      get: () => coords,
    });
  }

  // Static properties

  Object.assign(svg.node(), {
    info: {
      width: width,
      height: height + headerdelta + footerdelta,
      height_map: height,
      height_header: headerdelta,
      height_footer: footerdelta,
      projection: projection,
      bbox: myheight.bbox,
    },
  });

  // Update function
  svg.node().update = function update({
    id = null,
    attr = null,
    value = null,
    legend = null,
    duration = 0,
    delay = 0,
  } = {}) {
    update_main({
      svg,
      projection,
      width,
      height,
      id,
      attr,
      value,
      legend,
      duration,
      delay,
    });
  };

  // Output
  return svg.node();
}
