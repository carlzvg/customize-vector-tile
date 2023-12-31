<template lang="pug">
v-card#color-tree
  v-expansion-panels(variant="accordion")
    v-expansion-panel(
      v-for="color in colorLibrary" 
      :key="`color-${color.id}`")
      v-expansion-panel-title
        .d-inline-flex.justify-space-between.w-75
          .pane
            v-btn(:color="color.original" density="compact" v-bind="props")
            .text-overline {{ color.original }}
          .pane
            v-menu(:close-on-content-click="false")
              template(v-slot:activator="{ props }")
                v-btn(:color="color.color" density="compact" v-bind="props" style="text-align: end")
              v-color-picker(v-model="color.color" mode="hex" @update:modelValue="(evt) => loadStyleDeb(evt, color)")
            .text-overline {{ color.color }}

      v-expansion-panel-text
        v-list(lines="one")
          v-list-item(
            v-for="layer in color.layers" 
            :key="`color-layers-${layer.id}`") {{ layer.id }}
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ColorTree',
  inject: ['mapView', 'mapStyle'],
  data: () => ({
    colorLibrary: [],
  }),
  mounted() {
    this.setColorLibrary();
  },
  methods: {
    setColorLibrary() {
      this.mapStyle.forEach((styleLibrary) => {
        styleLibrary.layers.forEach((layer) => {
          if (layer.paint && 'fill-color' in layer.paint) {
            const targetColor = layer.paint['fill-color'];
            const isColorExisted = this.colorLibrary.find((color) => color.color === targetColor);

            if (!isColorExisted) {
              this.colorLibrary.push({
                id: _.uniqueId(),
                original: targetColor,
                color: targetColor,
                layers: [],
              });
            }

            const colorRecord = this.colorLibrary.find((color) => color.color === targetColor);
            colorRecord.layers.push(layer);
          }
        })
      });
    },
    loadStyleDeb: _.debounce(function(evt, colorGroup) {
      this.loadStyle(evt, colorGroup);
    }, 1000),
    loadStyle(evt, colorGroup) {
      this.mapStyle.forEach((styleLib) => {
        styleLib.layers.forEach((layer) => {
          const targetLayer = colorGroup.layers.find((colorGroupLayer) => colorGroupLayer.id === layer.id);
          
          if (!targetLayer) return;

          if ('fill-color' in targetLayer.paint) {
            layer.paint['fill-color'] = evt;
          }
        })
      });

      this.mapView.basemapView.baseLayerViews.forEach((layer) => {
        this.mapStyle.forEach((lib) => {
          if (layer.layer) layer.layer.loadStyle(lib);
        });
      });
    },
  },
}
</script>

<style lang="scss">
#color-tree {
  position: fixed;
  bottom: 28px;
  left: 10px;
  z-index: 9;

  max-width: 50vw;
  max-height: 40vh;

  overflow-y: scroll;
}
</style>
