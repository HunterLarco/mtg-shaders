out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;

void main() {
  // THREE.js includes shader code which can be imported for several common use
  // cases. Here we include the shader chunks required to correctly implement a
  // generic vertex shader similar to how `THREE.MeshBasicMaterial` is
  // implemented.
  #include <begin_vertex>
  #include <project_vertex>

  vUv = uv;

  // We compute the normal in world coordinates.
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}
