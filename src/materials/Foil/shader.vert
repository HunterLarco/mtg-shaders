out vec2 vUv;

void main() {
  // THREE.js includes shader code which can be imported for several common use
  // cases. Here we include the shader chunks required to correctly implement a
  // generic vertex shader similar to how `THREE.MeshBasicMaterial` is
  // implemented.
  #include <begin_vertex>
  #include <project_vertex>

  vUv = uv;
}
