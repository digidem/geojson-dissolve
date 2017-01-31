var turfUnion = require('@turf/union')
var dissolveLineStrings = require('geojson-linestring-dissolve')
var clone = require('clone')

module.exports = dissolve

// [a], (a -> Bool) -> [a, a]
function partition (lst, fn) {
  var result = [[], []]

  lst.forEach(function (a) {
    if (fn(a)) {
      result[0].push(a)
    } else {
      result[1].push(a)
    }
  })

  return result
}

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

// [GeoJSON] -> [GeoJSON]
function flattenMultiPolygonsAndMultiLineStrings (geoms) {
  return geoms.reduce(function (accum, geom) {
    if (geom.type === 'MultiLineString') {
      return accum.concat(flattenMultiLineString(geom))
    } else if (geom.type === 'MultiPolygon') {
      return accum.concat(flattenMultiPolygon(geom))
    } else {
      accum.push(geom)
      return accum
    }
  }, [])
}

// [GeoJSON], String, (GeoJSON -> GeoJSON) -> [GeoJSON]
function dissolveFromList (geoms, type, dissolveFn) {
  var result = partition(geoms, function (geo) {
    return geo.type === type
  })
  var dissolved = dissolveFn(result[0])
  return result[1].concat(dissolved)
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

// Transform function: attempts to dissolve geojson elements where possible
// GeoJSON -> GeoJSON
function dissolve (geom) {
  switch (geom.type) {
    case 'MultiLineString':
      var lineStrings = geom.coordinates.map(function (coords) {
        return {
          type: 'LineString',
          coordinates: coords
        }
      })
      return dissolveLineStrings(lineStrings)
    case 'MultiPolygon':
      var polygons = geom.coordinates.map(function (polyCoords) {
        return {
          type: 'Polygon',
          coordinates: polyCoords
        }
      })
      return dissolvePolygons(polygons)
    case 'GeometryCollection':
      var geoms = clone(geom.geometries)
      geoms = flattenMultiPolygonsAndMultiLineStrings(geom.geometries)
      geoms = dissolveFromList(geoms, 'Polygon', dissolvePolygons)
      geoms = dissolveFromList(geoms, 'LineString', dissolveLineStrings)
      geom.geometries = geoms
      return geom
    case 'Feature':
      geom = clone(geom)
      geom.geometry = dissolve(geom.geometry)
      return geom
    case 'FeatureCollection':
      geom = clone(geom)
      geom.features = geom.features.map(dissolve)
      return geom
    default:
      return geom
  }
}

