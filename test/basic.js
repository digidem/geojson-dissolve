var test = require('tape')
var dissolve = require('../')

test('MultiLineString within FeatureCollection', function (t) {
  var geojson = {
    'type': 'FeatureCollection',
    'features': [
      { 'type': 'Feature',
        'geometry': {'type': 'Point', 'coordinates': [102.0, 0.5]},
        'properties': {'prop0': 'value0'}
        },
      { 'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [
            [
              [100.0, 0.0], [100.1, 1.0], [100.2, 0.0], [102.0, 0.0]
            ],
            [
              [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
            ]
          ]
        },
        'properties': {
          'prop0': 'value0',
          'prop1': 0.0
        }
        },
      { 'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
          ]
        },
        'properties': {
          'prop0': 'value0',
          'prop1': 0.0
        }
        },
      { 'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                [100.0, 1.0], [100.0, 0.0] ]
            ]
          },
          'properties': {
            'prop0': 'value0',
            'prop1': {'this': 'that'}
          }
          }
    ]
  }

  var expected = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [ 102, 0.5 ] },
        properties: { prop0: 'value0' }
      },
      {
        type: 'Feature',
        properties: { prop0: 'value0', prop1: 0 },
        geometry: {
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
      },
      {
        type: 'Feature',
        properties: { prop0: 'value0', prop1: 0 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [ 102, 0 ], [ 103, 1 ], [ 104, 0 ], [ 105, 1 ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { prop0: 'value0', prop1: { this: 'that' } },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [ [ 100, 0 ], [ 101, 0 ], [ 101, 1 ], [ 100, 1 ], [ 100, 0 ] ]
          ]
        }
      }
    ]
  }

  t.deepEqual(dissolve(geojson), expected)
  t.end()
})

test('MultiPolygon -> Polygon', function (t) {
  var geojson = {
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
          [ -1, 1 ],
          [ 0, 2 ],
          [ 1, 1 ]
        ]
      ]
    ]
  }

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

test('GeometryCollection', function (t) {
  var geojson = {
    type: 'GeometryCollection',
    geometries: [
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
              [ -1, 1 ],
              [ 0, 2 ],
              [ 1, 1 ]
            ]
          ]
        ]
      },
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
  }

  var expected = {
    type: 'GeometryCollection',
    geometries: [
      {
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
      },
      {
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
    ]
  }

  t.deepEqual(dissolve(geojson), expected)
  t.end()
})
