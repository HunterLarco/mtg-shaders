import * as THREE from 'three';
import { ref, shallowRef, onMounted, onUnmounted, watch } from 'vue';

import type { ShallowRef, Ref } from 'vue';

export type WebGLCanvas = {
  canvas: ShallowRef<HTMLCanvasElement | undefined>;

  width: Ref<number>;
  height: Ref<number>;

  renderer: ShallowRef<THREE.WebGLRenderer | undefined>;
  camera: ShallowRef<THREE.PerspectiveCamera>;

  onReady: (callback: OnReadyCallback) => void;
  onDispose: (callback: OnDisposeCallback) => void;
};

export type OnReadyCallback = (args: {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
}) => void;

export type OnDisposeCallback = (args: {
  renderer: THREE.WebGLRenderer;
}) => void;

export const useWebGLCanvas = (
  canvas: ShallowRef<HTMLCanvasElement | undefined>,
): WebGLCanvas => {
  const width = ref(0);
  const height = ref(0);
  const renderer = shallowRef<THREE.WebGLRenderer>();
  const camera = shallowRef(new THREE.PerspectiveCamera(70, 1, 0.001, 1000));

  let onReady: OnReadyCallback | null = null;
  let onDispose: OnDisposeCallback | null = null;

  camera.value.position.z = 10;

  watch(canvas, () => {
    if (renderer.value != null) {
      renderer.value.dispose();
      if (onDispose != null) {
        onDispose({ renderer: renderer.value });
      }
    }
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: true,
    });
    renderer.value.setPixelRatio(window.devicePixelRatio);
    resize();
    if (onReady != null) {
      onReady({ renderer: renderer.value, camera: camera.value });
    }
  });

  onMounted(() => {
    resize();
    window.addEventListener('resize', resize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    if (renderer.value != null) {
      renderer.value.dispose();
      if (onDispose != null) {
        onDispose({ renderer: renderer.value });
      }
      renderer.value = undefined;
    }
  });

  const resize = () => {
    if (canvas.value == null) {
      return;
    }

    const parentElement = canvas.value.parentElement;
    if (parentElement == null) {
      console.warn('Unable to resize canvas.');
      return;
    }

    width.value = parentElement.offsetWidth;
    height.value = parentElement.offsetHeight;
    canvas.value.width = width.value;
    canvas.value.height = height.value;
    camera.value.aspect = width.value / height.value;
    camera.value.updateProjectionMatrix();
    if (renderer.value != null) {
      renderer.value.setSize(width.value, height.value);
    }
  };

  return {
    canvas,
    width,
    height,
    renderer,
    camera,
    onReady(callback) {
      onReady = callback;
      if (renderer.value != null) {
        callback({ renderer: renderer.value, camera: camera.value });
      }
    },
    onDispose(callback) {
      onDispose = callback;
    },
  };
};
