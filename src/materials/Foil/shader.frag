uniform sampler2D card;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;

out vec4 gFragColor;

struct PointLight {
  vec3 position;
  vec3 color;
  float distance;
  float decay;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

#include <common>

const vec2 visibleRange = vec2(PI_HALF * 0.35, PI_HALF * 0.45);

float inverseLerp(in float lower, in float upper, in float value) {
  return clamp((value - lower) / (upper - lower), 0., 1.);
}

vec3 hueGradient(in float p) {
  return sqrt(abs(mod(clamp(p, 0., 1.)*4. + vec4(0,4,2,0), 6.)-3.)-1.).xyz;
}

void main() {
  gFragColor = texture(card, vUv);

  vec3 lightRay = normalize(vPosition - pointLights[0].position);
  float lightAngle = acos(dot(lightRay, -1. * vNormal));

  vec3 cameraRay = normalize(vPosition - cameraPosition);
  float cameraAngle = acos(dot(cameraRay, -1. * vNormal));

  vec3 lightColor = hueGradient(inverseLerp(visibleRange.x, visibleRange.y, lightAngle));
  float lightAlpha = lightAngle >= visibleRange.x && lightAngle <= visibleRange.y ? 0.8 : 0.;

  vec3 cameraColor = hueGradient(inverseLerp(visibleRange.x, visibleRange.y, cameraAngle));
  float cameraAlpha = cameraAngle >= visibleRange.x && cameraAngle <= visibleRange.y ? 0.8 : 0.;

  // Translate the output color from linear color space to color space of
  // the THREE RenderTarget.
  gFragColor = texture(card, vUv);
  if (lightAlpha > 0. && cameraAlpha > 0.) {
  gFragColor = vec4(mix(gFragColor.rgb, lightColor, lightAlpha), 1);
  gFragColor = vec4(mix(gFragColor.rgb, cameraColor, cameraAlpha), 1);
  }
  gFragColor = linearToOutputTexel(gFragColor);
}
