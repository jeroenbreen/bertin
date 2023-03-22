import { legchoro } from "./leg-choro.js";
import { legtypo } from "./leg-typo.js";
import { legthicknesslinear } from "./leg-thickness-linear.js";
import { legthicknessdiscr } from "./leg-thickness-discr.js";
import { legthicknessquali } from "./leg-thickness-quali.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";

export function legends(geojson, selection, fill, stroke, strokeWidth, id) {
  if (typeof fill == "object" && fill.type == "choro") {
    legchoro(selection, {
      x: fill.leg_x,
      y: fill.leg_y,
      w: fill.leg_w,
      h: fill.leg_h,
      stroke: fill.leg_stroke,
      fillOpacity: fill.leg_fillOpacity,
      strokeWidth: fill.leg_strokeWidth,
      txtcol: fill.leg_txtcol,
      title: fill.leg_title ? fill.leg_title : fill.values,
      fontSize: fill.leg_fontSize,
      fontSize2: fill.leg_fontSize2,
      breaks: colorize(geojson.features, fill).breaks,
      colors: colorize(geojson.features, fill).colors,
      missing: colorize(geojson.features, fill).missing,
      id: "leg_" + id,
    });
  }

  if (typeof stroke == "object" && stroke.type == "choro") {
    legchoro(selection, {
      x: stroke.leg_x,
      y: stroke.leg_y,
      w: stroke.leg_w,
      h: stroke.leg_h,
      stroke: stroke.leg_stroke,
      fillOpacity: stroke.leg_fillOpacity,
      strokeWidth: stroke.leg_strokeWidth,
      txtcol: stroke.leg_txtcol,
      title: stroke.leg_title ? stroke.leg_title : stroke.values,
      fontSize: stroke.leg_fontSize,
      fontSize2: stroke.leg_fontSize2,
      breaks: colorize(geojson.features, stroke).breaks,
      colors: colorize(geojson.features, stroke).colors,
      missing: colorize(geojson.features, stroke).missing,
      id: "leg_" + id,
    });
  }

  if (
    typeof fill == "object" &&
    (fill.type == "typo" || fill.type == "split")
  ) {
    legtypo(selection, {
      x: fill.leg_x,
      y: fill.leg_y,
      w: fill.leg_w,
      h: fill.leg_h,
      stroke: fill.leg_stroke,
      fillOpacity: fill.leg_fillOpacity,
      strokeWidth: fill.leg_strokeWidth,
      txtcol: fill.leg_txtcol,
      title: fill.leg_title ? fill.leg_title : fill.values,
      fontSize: fill.leg_fontSize,
      fontSize2: fill.leg_fontSize2,
      types: colorize(geojson.features, fill).types,
      colors: colorize(geojson.features, fill).colors,
      id: "leg_" + id,
    });
  }

  if (
    typeof stroke == "object" &&
    (stroke.type == "typo" || stroke.type == "split")
  ) {
    legtypo(selection, {
      x: stroke.leg_x,
      y: stroke.leg_y,
      w: stroke.leg_w,
      h: stroke.leg_h,
      stroke: stroke.leg_stroke,
      fillOpacity: stroke.leg_fillOpacity,
      strokeWidth: stroke.leg_strokeWidth,
      txtcol: stroke.leg_txtcol,
      title: stroke.leg_title ? stroke.leg_title : stroke.values,
      fontSize: stroke.leg_fontSize,
      fontSize2: stroke.leg_fontSize2,
      types: colorize(geojson.features, stroke).types,
      colors: colorize(geojson.features, stroke).colors,
      id: "leg_" + id,
    });
  }

  if (
    typeof strokeWidth == "object" &&
    strokeWidth.values != undefined &&
    (strokeWidth.type == "linear" || strokeWidth.type == undefined)
  ) {
    legthicknesslinear(selection, {
      x: strokeWidth.leg_x,
      y: strokeWidth.leg_y,
      valmax: thickness(geojson.features, strokeWidth).valmax,
      valmin: thickness(geojson.features, strokeWidth).valmin,
      sizemax: thickness(geojson.features, strokeWidth).sizemax,
      title: strokeWidth.leg_title ? strokeWidth.leg_title : strokeWidth.values,
      fontSize: strokeWidth.leg_fontSize,
      fontSize2: strokeWidth.leg_fontSize2,
      fill: strokeWidth.stroke,
      fillOpacity: strokeWidth.fillOpacity,
      txtcol: strokeWidth.leg_txtcol,
      w: strokeWidth.leg_w,
      round: strokeWidth.leg_round,
      id: "leg_" + id,
    });
  }

  if (
    typeof strokeWidth == "object" &&
    strokeWidth.values != undefined &&
    strokeWidth.type == "discr"
  ) {
    legthicknessdiscr(selection, {
      x: strokeWidth.leg_x,
      y: strokeWidth.leg_y,
      breaks: thickness(geojson.features, strokeWidth).breaks,
      sizes: thickness(geojson.features, strokeWidth).sizes,
      w: strokeWidth.leg_w,
      title: strokeWidth.leg_title ? strokeWidth.leg_title : strokeWidth.values,
      fontSize: strokeWidth.leg_fontSize,
      fontSize2: strokeWidth.leg_fontSize2,
      stroke: strokeWidth.stroke,
      strokeOpacity: strokeWidth.strokeOpacity,
      txtcol: strokeWidth.leg_txtcol,
      round: strokeWidth.leg_round,
      id: "leg_" + id,
    });
  }

  if (
    typeof strokeWidth == "object" &&
    strokeWidth.values != undefined &&
    strokeWidth.type == "quali"
  ) {
    legthicknessquali(selection, {
      x: strokeWidth.leg_x,
      y: strokeWidth.leg_y,
      categories: thickness(geojson.features, strokeWidth).categories,
      sizes: thickness(geojson.features, strokeWidth).sizes,
      w: strokeWidth.leg_w,
      title: strokeWidth.leg_title ? strokeWidth.leg_title : "Catégories",
      fontSize: strokeWidth.leg_fontSize,
      fontSize2: strokeWidth.leg_fontSize2,
      stroke: strokeWidth.stroke,
      strokeOpacity: strokeWidth.strokeOpacity,
      txtcol: strokeWidth.leg_txtcol,
      id: "leg_" + id,
    });
  }
}
