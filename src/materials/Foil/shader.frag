uniform sampler2D card;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;
in vec3 vLightSource;

out vec4 gFragColor;

#define M_PI 3.1415926535897932384626433832795
#define M_PI_2 (M_PI * 0.5)

const vec2 visibleRange = vec2(M_PI_2 * 0., M_PI_2 * 1.);

float inverseLerp(in float lower, in float upper, in float value) {
  return clamp((value - lower) / (upper - lower), 0., 1.);
}

vec3 hueGradient(in float p) {
  return sqrt(abs(mod(clamp(p, 0., 1.)*4. + vec4(0,4,2,0), 6.)-3.)-1.).xyz;
}

void main() {
  gFragColor = texture(card, vUv);

  vec3 cameraRay = normalize(vPosition - vLightSource);
  float angle = acos(dot(cameraRay, -1. * vNormal));
  vec3 color = hueGradient(inverseLerp(visibleRange.x, visibleRange.y, angle));
  float alpha = angle >= visibleRange.x && angle <= visibleRange.y ? 1. : 0.;

  // Translate the output color from linear color space to color space of
  // the THREE RenderTarget.
  gFragColor = linearToOutputTexel(vec4(color, alpha));
}
