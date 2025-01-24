uniform sampler2D card;

in vec2 vUv;
in vec3 vNormal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToCamera;

out vec4 gFragColor;

#include <common>

vec3 RGBtoHSV(in vec3 RGB) {
    vec4  P   = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
    vec4  Q   = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
    float C   = Q.x - min(Q.w, Q.y);
    float H   = abs((Q.w - Q.y) / (6.0 * C + EPSILON) + Q.z);
    vec3  HCV = vec3(H, C, Q.x);
    float S   = HCV.y / (HCV.z + EPSILON);
    return vec3(HCV.x, S, HCV.z);
}

vec3 HSVtoRGB(in vec3 HSV) {
    float H   = HSV.x;
    float R   = abs(H * 6.0 - 3.0) - 1.0;
    float G   = 2.0 - abs(H * 6.0 - 2.0);
    float B   = 2.0 - abs(H * 6.0 - 4.0);
    vec3  RGB = clamp( vec3(R,G,B), 0.0, 1.0 );
    return ((RGB - 1.0) * HSV.y + 1.0) * HSV.z;
}

vec3 RainbowFoil(in vec2 uv) {
    float H = sin(uv.x * uv.y * PI * 6.0);
    float R = 2.0 - abs(H * 5.0 - 4.0);
    float G = 2.0 - abs(H * 5.0 - 2.0);
    float B = abs(H * 5.0 - 3.0) - 1.0;
    return clamp( vec3(R,G,B), 0.0, 1.0 );
}

void main() {
  gFragColor = texture(card, vUv);

  /// Because these inputs are varying, they are not normalized.

  vec3 normal = normalize(vNormal);
  vec3 surfaceToLight = normalize(v_surfaceToLight);
  vec3 surfaceToCamera = normalize(v_surfaceToCamera);

  /// 

  vec3 halfVector = normalize(surfaceToLight + surfaceToCamera);

  float light = dot(normal, surfaceToLight);
  float specular = 0.0;
  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), 50.0);
  }

  vec4 color = texture2D(card, vUv);
  color.rgb *= light;

  // Increase saturation by 2x (from https://stackoverflow.com/questions/53879537/)
  // optionally check to see if value is > 0.8
  vec3 col_hsv = RGBtoHSV(color.rgb);
  col_hsv.y *= 1. + clamp(specular, 0., 1.);
  vec3 col_rgb = HSVtoRGB(col_hsv.rgb);
  color = vec4(col_rgb.rgb, color.a);

  color.rgb += specular;
  // color.rgb += specular * RainbowFoil(vUv);

  gFragColor = linearToOutputTexel(color);
}
