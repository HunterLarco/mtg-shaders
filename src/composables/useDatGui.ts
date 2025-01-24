import * as dat from 'dat.gui';
import { shallowRef, onMounted, onUnmounted } from 'vue';

import type { ShallowRef } from 'vue';

export type DatGui = {
  gui: ShallowRef<dat.GUI>;
};

export const useDatGui = (): DatGui => {
  const gui = shallowRef(new dat.GUI());
  gui.value.width = 300;
  gui.value.hide();

  onMounted(() => {
    gui.value.show();
  });

  onUnmounted(() => {
    gui.value.hide();
  });

  return {
    gui,
  };
};
