var turfUnion = require('@turf/union')
var dissolveLineStrings = require('geojson-linestring-dissolve')

module.exports = dissolve

// MultiPolygon -> [Polygon]
function flattenMultiPolygon (multi) {
  return multi.coordinates.map(function (p) {
    return {
      type: 'Polygon',
      coordinates: p
    }
  })
}

// MultiLineString -> [LineString]
function flattenMultiLineString (multi) {
  return multi.coordinates.map(function (p) {
    return {
      type: 'LineString',
      coordinates: p
    }
  })
}

function dissolvePolygons (lst) {
  // Map polygons to features -- turf-union requires this.
  lst = lst.map(function (poly) {
    return {
      type: 'Feature',
      properties: {},
      geometry: poly
    }
  })

  // turf-union also requires the list of polygons be provided as explicit
  // function arguments.
  var feature = turfUnion.apply(this, lst)

  // Unpack the Feature back into its contents.
  var result = feature.geometry

  return result
}

// [GeoJSON] -> String|Null
function getHomogenousType (geoms) {
  var type = null
  for (var i = 0; i < geoms.length; i++) {
    if (!type) {
      type = geoms[i].type
    } else if (type !== geoms[i].type) {
      return null
    }
  }
  return type
}

// Transform function: attempts to dissolve geojson elements where possible
// [GeoJSON] -> GeoJSON
function dissolve (geoms) {
  // Assert homogenity
  var type = getHomogenousType(geoms)
  if (!type) {
    throw new Error('List does not contain only homoegenous GeoJSON')
  }

  switch (type) {
    case 'LineString':
      return dissolveLineStrings(geoms)
    case 'MultiLineString':
      var lineStrings = geoms.reduce(function (accum, ls) {
        return accum.concat(flattenMultiLineString(ls))
      }, [])
      return dissolveLineStrings(lineStrings)
    case 'Polygon':
      return dissolvePolygons(geoms)
    case 'MultiPolygon':
      var polygons = geoms.reduce(function (accum, poly) {
        return accum.concat(flattenMultiPolygon(poly))
      }, [])
      return dissolvePolygons(polygons)
    default:
      return geoms
  }
}

