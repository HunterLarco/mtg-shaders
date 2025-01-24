uniform sampler2D card;

in vec2 vUv;

out vec4 gFragColor;

void main() {
  gFragColor = texture(card, vUv);

  // Translate the output color from linear color space to color space of
  // the THREE RenderTarget.
  gFragColor = linearToOutputTexel(gFragColor);
}
