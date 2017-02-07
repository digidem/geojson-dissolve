var test = require('tape')
var dissolve = require('../')

test('MultiLineString -> LineString', function (t) {
  var geojson = [
    {
      'type': 'MultiLineString',
      'coordinates': [
        [
          [100.0, 0.0], [100.1, 1.0], [100.2, 0.0], [102.0, 0.0]
        ],
        [
          [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
        ]
      ]
    }
  ]

  var expected = {
    type: 'LineString',
    coordinates: [
      [ 100, 0 ],
      [ 100.1, 1 ],
      [ 100.2, 0 ],
      [ 102, 0 ],
      [ 103, 1 ],
      [ 104, 0 ],
      [ 105, 1 ]
    ]
  }

  t.deepEqual(dissolve(geojson), expected)
  t.end()
})

test('MultiPolygon -> Polygon', function (t) {
  var geojson = [
    {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [ 0, 0 ],
            [ 1, 1 ],
            [ -1, 1 ],
            [ 0, 0 ]
          ]
        ],
        [
          [
            [ 1, 1 ],
            [ 0, 2 ],
            [ -1, 1 ],
            [ 1, 1 ]
          ]
        ]
      ]
    }
  ]

  var expected = {
    type: 'Polygon',
    coordinates: [
      [
        [1, 1],
        [0, 0],
        [-1, 1],
        [0, 2],
        [1, 1]
      ]
    ]
  }

  t.deepEqual(dissolve(geojson), expected)
  t.end()
})

