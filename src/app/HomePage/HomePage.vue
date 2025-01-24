<script setup lang="ts">
import { shallowRef } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import * as composables from '@/composables';
import * as materials from '@/materials';

/// Initialize the canvas.

const canvas = shallowRef<HTMLCanvasElement>();

const { onReady } = composables.useWebGLCanvas(canvas);

const textureLoader = shallowRef<THREE.TextureLoader>(
  new THREE.TextureLoader(),
);
const foilMaterial = shallowRef(materials.foil.createFoilMaterial({}));

onReady(async ({ renderer, camera }) => {
  const controls = new TransformControls(camera, renderer.domElement);
  camera.position.z = 4;

  /// Create the scene.

  const scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffffff, 50.0);
  light.position.set(0, 0, 10);
  scene.add(light);

  const cardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5 / 7, 1),
    foilMaterial.value.threeMaterial,
  );

  updateCardTexture(textureUrl.value);

  scene.add(cardMesh);

  controls.attach(cardMesh);
  controls.setMode('rotate');
  const gizmo = controls.getHelper();
  scene.add(gizmo);

  /// Animate.

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});

const updateCardTexture = async (url: string): void => {
  foilMaterial.value.setCard(await textureLoader.value.loadAsync(url));
};

/// Configure the dat.gui

const { gui } = composables.useDatGui();

const textureUrl = shallowRef(
  'https://cards.scryfall.io/border_crop/front/6/1/61da9522-3844-4753-8122-d11ae2780a4c.jpg?1721427507',
);

gui.value.add(textureUrl, 'value').onFinishChange(updateCardTexture);
</script>

<template>
  <div :class="$style.Host">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style module>
.Host {
  height: 100vh;
  overflow: hidden;
  position: absolute;
  width: 100vw;
}
</style>
