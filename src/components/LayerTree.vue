<template lang="pug">
v-card#layer-tree
  v-card-item
    v-expansion-panels(
      v-for="(styleLib, styleLibIdx) in styleLibs"
      :key="`styleLib-${styleLibIdx}`" 
      variant="accordion")
      v-expansion-panel(
        v-for="(layer, layerIdx) in styleLib.layers" 
        :key="`layer-${layerIdx}-${layer.id}`")
        v-expansion-panel-title {{ layer.id }}
        v-expansion-panel-text
          .style-fill(v-if="layer.type == 'fill'")
            v-menu(:close-on-content-click="false")
              template(v-slot:activator="{ props }")
                v-btn(:color="layer.paint['fill-color']" density="compact" v-bind="props")
              v-color-picker(v-model="layer.paint['fill-color']" mode="hex" @update:modelValue="loadStyle")

</template>

<script>
import sampleStyle from '@/assets/sampleStyle.json';

export default {
  props: {
    layerView: Object,
  },
  data: () => ({
    layerTree: [],
    styleUrls: [],
    styleLibs: [],
  }),
  mounted() {
    this.styleLibs = [sampleStyle];
    // this.layerView.forEach((layer) => {
    //   this.styleUrls.push(layer.layer.styleUrl);
    // });

    // this.styleUrls.map(this.downloadStyleJson);
  },
  methods: {
    loadStyle(evt) {
      console.log('loadStyle', evt);
      this.layerView.forEach((layer) => {
        this.styleLibs.forEach((lib) => {
          if (layer.layer) layer.layer.loadStyle(lib);
        });
      });
    },
    async downloadStyleJson(url) {
      return await fetch(url)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          return res;
        })
        .then((res) => this.styleLibs.push(res));
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
