var createTopology = require('topojson-server').topology
var mergeTopology = require('topojson-client').merge
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
  var topo = createTopology(lst)
  return mergeTopology(topo, topo.objects)
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
  // Topojson modifies in place, so we need to deep clone first
  geoms = JSON.parse(JSON.stringify(geoms))

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

