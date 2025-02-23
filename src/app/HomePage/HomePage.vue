<script setup lang="ts">
import { shallowRef } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as composables from '@/composables';
import * as materials from '@/materials';
import ApartmentEnvironment from '@/assets/lebombo_1k.hdr';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

/// Initialize the canvas.

const canvas = shallowRef<HTMLCanvasElement>();

const { onReady } = composables.useWebGLCanvas(canvas);

const textureLoader = shallowRef<THREE.TextureLoader>(
  new THREE.TextureLoader(),
);
const foilMaterial = shallowRef(new THREE.MeshPhysicalMaterial({}));

onReady(async ({ renderer, camera }) => {
  new OrbitControls(camera, renderer.domElement);
  camera.position.z = 4;

  /// Create the scene.

  const scene = new THREE.Scene();

  const environment = await (new RGBELoader()).loadAsync(ApartmentEnvironment);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = environment;

  const texture = await textureLoader.value.loadAsync(textureUrl.value);
  const cardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 3.5),
    new THREE.MeshPhysicalMaterial({
      map: texture,
      transmission: 0.95,
      reflectivity: 0.6,
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [10, 500],
    })
  );

  // updateCardTexture(textureUrl.value);

  scene.add(cardMesh);


  const light = new THREE.PointLight(0xffffff, 75.0);
  light.position.set(2.5, 0, 2.5);
  scene.add(light);

  /// Animate.

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});

const updateCardTexture = async (url: string): Promise<void> => {
  foilMaterial.value.map = await textureLoader.value.loadAsync(url);
  foilMaterial.value.needsUpdate = true;
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
