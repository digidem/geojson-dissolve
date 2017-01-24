# geojson-dissolve

> Dissolve contiguous GeoJSON LineStrings and Polygons into single units.

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

var geometry = {
  type: 'GeometryCollection'
  geometries: [
    line1,
    line2
  ]
}

console.log(dissolve(geometry))
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

Consumes [GeoJSON](http://geojson.org/geojson-spec.html), and returns a new
GeoJSON object, with all touching `LineString`s and `Polygon`s merged into
single units.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install geojson-dissolve
```

## License

ISC

