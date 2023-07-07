<script setup>
import { provide, reactive, onMounted, toRaw } from 'vue';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';

import { HK80 } from '@/constants/gisConstants';
import { basemapLayers, basicLayers } from '@/constants/layerConstants';
import { makeLayer } from '@/utils/configLayers';

import LayerTree from '@/components/LayerTree.vue';

let layers = reactive({
  basemap: [],
  basic: []
});
basemapLayers.forEach((layer) => layers.basemap.push(makeLayer(layer)));
basicLayers.forEach((layer) => layers.basic.push(makeLayer(layer)));

const map = new Map({
  basemap: new Basemap({
    baseLayers: toRaw(layers.basemap),
  })
});
provide('map', map);

const mapView = new MapView({
  map,
  center: {
    x: 828988,
    y: 824199,
    spatialReference: HK80
  },
  zoom: 13,
  spatialReference: HK80,
  // ui: { components: [] }
});
provide('mapView', mapView);

onMounted(() => {
  mapView.container = 'map-container';
});
</script>

<template lang="pug">
#map-wrapper
  layer-tree(:layerView="mapView.basemapView.baseLayerViews")
  #map-container
</template>

<style lang="scss" scoped>
@import "https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/dark/main.css";

#map-wrapper,
#map-container {
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow: hidden;
}
</style>
