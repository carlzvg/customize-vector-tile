import { LODS, HK80 } from '@/constants/gisConstants';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import Point from '@arcgis/core/geometry/Point';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';

const baseTileInfo = () =>
  new TileInfo({
    dpi: 96,
    lods: LODS,
    spatialReference: HK80,
    size: [256, 256],
    origin: new Point(-4786700.0, 8353100.0, HK80),
  });

const makeVectorTileLayer = properties => {
  return new VectorTileLayer({
    ...properties,
  });
}

const makeWebTileLayer = properties => {
  return new WebTileLayer({
    tileInfo: baseTileInfo(),
    spatialReference: HK80,
    ...properties,
  });
};

const makeTileLayer = properties => {
  return new TileLayer({
    tileInfo: baseTileInfo(),
    ...properties,
  });
};

const makeMapImageLayer = properties => {
  return new MapImageLayer({
    ...properties,
  });
};

const makeWmsLayer = properties => {
  return new WMSLayer({
    ...properties,
  });
};

const makeLayer = properties => {
  if (!properties?.layerType)
    throw new Error('[configLayers.js] func <makeLayer> missing layer type');

  switch (properties.layerType) {
    case 'tile':
      return makeTileLayer(properties);
    case 'web-tile':
      return makeWebTileLayer(properties);
    case 'vector-tile':
      return makeVectorTileLayer(properties);
    case 'map-image':
      return makeMapImageLayer(properties);
    case 'wms':
      return makeWmsLayer(properties);
    default:
      throw new Error('[configLayers.js] func <makeLayer> unknown layer type');
  }
};

export { baseTileInfo, makeWebTileLayer, makeTileLayer, makeLayer };
