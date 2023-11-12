const {Router} = require('express');
const route = Router();
var turf = require('@turf/turf');

route.post("/voronoi", (req, res) => {
    const collection = req.body;
    const bbox = turf.bbox(collection);
    var options = {
        bbox
      };
    var voronoiPolygons = turf.voronoi(collection, options);
    res.json(voronoiPolygons);
})

route.post("/convex", (req, res) => {
  const collection = req.body;
  var voronoiPolygons = turf.convex(collection);
  res.json(voronoiPolygons);
})


module.exports = route;