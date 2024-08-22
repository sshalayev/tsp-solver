const {RRoute} = require("./RLineFactory");
const {RPointFactory} = require("./RPointFactory");

class DXFDataComposer {
  static buildRoutes(dxfData) {
    return DXFDataComposer.buildRoutesInternally(DXFDataComposer.buildPartialsFromShapes(dxfData));
  }

  static buildRoutesTransformed(dxfData, scale) {
    return DXFDataComposer.buildRoutesInternally(DXFDataComposer.buildTransformedPartialsFromShapes(dxfData, scale));
  }

  static buildRoutesInternally(partials){
    const originalLength = partials.length;
    const routes = [];
    let currentRoute = null;
    while (partials.length > 0){
      if (null == currentRoute)
        currentRoute = partials.shift();
      const len = currentRoute.length;
      const index = partials.findIndex(pr => currentRoute.canBeJoined(pr));
      if (index > -1 && currentRoute.tryJoin(partials[index]))
        partials.splice(index, 1);
      if (len === currentRoute.length || currentRoute.isClosed){
        routes.push(currentRoute);
        currentRoute = null
      }
    }
    if (null != currentRoute)
      routes.push(currentRoute);
    //console.log(`Built ${routes.length} routes from ${originalLength}`);
    return routes.length < originalLength ? DXFDataComposer.buildRoutesInternally(routes) : routes;
  }

  static buildPartialsFromShapes(dxfData){
    return dxfData.entities.map(entity =>
      RRoute.create(entity.polylinePoints.map(([x, y]) =>
        RPointFactory.getPoint(x, y)), false)
    );
  }

  static buildTransformedPartialsFromShapes(dxfData, positiveOffset = true, scale = 100){
    let offX = 0;
    let offY = 0;
    if (positiveOffset){
      const allPoints = dxfData.entities.reduce((res, ent) => null == ent.polylinePoints ? res : [...res, ...ent.polylinePoints], []);
      const pmin = allPoints.reduce((res, xy) => {
        const [x, y] = xy;
        res.x = Math.min(x, res.x);
        res.y = Math.min(y, res.y);
        return res;
      }, RPointFactory.getPoint(0, 0));

      offX = -1 * Math.floor(pmin.x);
      offY = -1 * Math.floor(pmin.y);
    }

    return dxfData.entities.map(entity =>
      RRoute.create(entity.polylinePoints.map(([x, y]) =>
        createTransformedPoint(x, y, offX, offY, scale))
      ), false
    );
  }
}

function createTransformedPoint(x, y, offX = 0, offY = 0, scale = 1){
  const tx = Math.round((x + offX) * scale);
  const ty = Math.round((y + offY) * scale);
  return RPointFactory.getPoint(tx, ty);
}

module.exports = DXFDataComposer;