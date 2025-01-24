import * as THREE from 'three';

import FRAGMENT_SHADER from '@/materials/Foil/shader.frag?raw';
import VERTEX_SHADER from '@/materials/Foil/shader.vert?raw';

export type FoilMaterialOptions = {
  card?: THREE.Texture;
};

export type FoilMaterial = {
  setCard: (texture: THREE.Texture | null) => void;

  readonly threeMaterial: THREE.ShaderMaterial;
};

export const createFoilMaterial = (
  options: FoilMaterialOptions,
): FoilMaterial => {
  const threeMaterial = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      { card: { value: options.card } },
    ]),
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    lights: true,
  });

  const setCard: FoilMaterial['setCard'] = (texture) => {
    threeMaterial.uniforms.card.value = texture;
  };

  return {
    setCard,
    get threeMaterial() {
      return threeMaterial;
    },
  };
};
