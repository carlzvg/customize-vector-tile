<template lang="pug">
v-card#layer-tree
  v-card-item
    v-switch(v-model="displayActiveLayerOnly" label="Active layer")
    v-expansion-panels(
      v-for="(styleLib, styleLibIdx) in mapStyle"
      :key="`styleLib-${styleLibIdx}`" 
      variant="accordion")
      v-expansion-panel(
        v-for="(layer, layerIdx) in styleLib.layers" 
        :key="`layer-${layerIdx}-${layer.id}`"
        v-show="isDisplayLayer(layer)")
        v-expansion-panel-title {{ layer.id }}
        v-expansion-panel-text
          .style-fill(v-if="layer.type == 'fill'")
            v-menu(:close-on-content-click="false")
              template(v-slot:activator="{ props }")
                v-btn(:color="layer.paint['fill-color']" density="compact" v-bind="props")
              v-color-picker(v-model="layer.paint['fill-color']" mode="hex" @update:modelValue="loadStyleDeb")
</template>

<script>
import _ from 'lodash';

export default {
  name: 'LayerTree',
  inject: ['mapView', 'mapStyle'],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    layerView: Object,
  },
  data: () => ({
    displayActiveLayerOnly: false,
  }),
  methods: {
    isDisplayLayer(layer) {
      if (!this.displayActiveLayerOnly) return true;

      return this.mapView.zoom >= (layer?.minzoom ?? 0) && this.mapView.zoom <= (layer?.maxzoom ?? 24);
    },
    loadStyleDeb: _.debounce(function() {
      this.loadStyle()
    }, 500),
    loadStyle(evt) {
      this.layerView.forEach((layer) => {
        this.mapStyle.forEach((lib) => {
          if (layer.layer) layer.layer.loadStyle(lib);
        });
      });
    },
    async downloadStyleJson(url) {
      return await fetch(url)
        .then((res) => res.json())
        .then((res) => this.mapStyle.push(res));
    },
  },
};
</script>

<style lang="scss">
#layer-tree {
  position: fixed;
  bottom: 28px;
  right: 10px;
  z-index: 9;

  max-width: 50vw;
  max-height: 40vh;

  overflow-y: scroll;
}
</style>
