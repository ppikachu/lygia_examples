#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#include "lygia/space/brick.glsl"
#include "lygia/space/ratio.glsl"
#include "lygia/space/nearest.glsl"
#include "lygia/draw/circle.glsl"
#include "lygia/draw/cross.glsl"
#include "lygia/draw/hex.glsl"
#include "lygia/draw/tri.glsl"
#include "lygia/draw/digits.glsl"
#include "lygia/animation/easing.glsl"

void main(){
  vec3 color = vec3(0.0);
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec2 st_b = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  st_b = ratio(st_b, u_resolution);
  float cdistance = distance(st, vec2(0.5));
  float size = 1.0 - cdistance * (u_mouse.x / u_resolution.x) * 3.0;
  float sizer = cdistance * (u_mouse.x / u_resolution.x);
  color += digits(st - 0.05, size);
  
  float ancho = 0.5;
  float fade = 0.5;
  st = brick(st, 12.0);
  st_b = brick(st_b, 12.0);
  color   += vec3(circle(st, size * 0.8, size * ancho)) * fade;
  color.r += circle(st_b, sizer * 1.0, sizer * ancho) * fade;
  
  gl_FragColor = vec4(color, 1.0);
}
