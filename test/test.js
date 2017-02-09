var test = require('tape')
var glob = require('glob')
var fs = require('fs')
var path = require('path')

var dissolve = require('../')

var REGEN = process.env.GEOJSON_DISSOLVE_REGEN

var pattern = path.join(__dirname, '/fixtures/in/*.geojson')

test('geojson-dissolve', function (t) {
  glob.sync(pattern).forEach(function (input) {
    var geojson = JSON.parse(fs.readFileSync(input))
    var output = dissolve(geojson)
    if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output, null, 2))
    t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input)
  })
  t.end()
})
