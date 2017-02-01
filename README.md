# geojson-dissolve

> Dissolve contiguous GeoJSON (Multi)LineStrings and (Multi)Polygons into single units.

## Usage

```js
var dissolve = require('geojson-dissolve')

var line1 = {
  type: 'LineString',
  coordinates: [
    [0.0, 0.0],
    [1.0, 1.0],
    [2.0, 2.0]
  ]
}

var line2 = {
  type: 'LineString',
  coordinates: [
    [2.0, 2.0],
    [3.0, 3.0]
  ]
}

console.log(dissolve([line1, line2]))
```

This will output

```
{
  type: 'LineString',
  coordinates: [
    [0.0, 0.0],
    [1.0, 1.0],
    [2.0, 2.0],
    [3.0, 3.0]
  ]
}
```

## API

```js
var dissolve = require('geojson-dissolve')
```

### dissolve([geojson])

Consumes a list of homogenous [GeoJSON
objects](http://geojson.org/geojson-spec.html), and returns a single GeoJSON
object, with all touching `LineString`s and `Polygon`s dissolved into single
units. If everything cannot be dissolved, a `Multi-*` form is returned.

Accepted types are `MultiLineString`, `LineString`, `MultiPolygon`, and
`Polygon`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install geojson-dissolve
```

## License

ISC

