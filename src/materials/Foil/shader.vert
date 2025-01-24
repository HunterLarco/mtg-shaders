struct PointLight {
  vec3 position;
  vec3 color;
  float distance;
  float decay;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

out vec2 vUv;
out vec3 vNormal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToCamera;

void main() {
  // THREE.js includes shader code which can be imported for several common use
  // cases. Here we include the shader chunks required to correctly implement a
  // generic vertex shader similar to how `THREE.MeshBasicMaterial` is
  // implemented.
  #include <begin_vertex>
  #include <project_vertex>

  vUv = uv;

  // TODO: this should use world inverse transpose
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  v_surfaceToLight = pointLights[0].position - worldPosition;
  v_surfaceToCamera = cameraPosition - worldPosition;
}
