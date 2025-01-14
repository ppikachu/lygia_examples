#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#include "lygia/space/brick.glsl"
#include "lygia/space/ratio.glsl"
#include "lygia/space/rotate.glsl"
#include "lygia/math/map.glsl"
#include "lygia/math/smootherstep.glsl"
#include "lygia/draw/digits.glsl"
#include "lygia/sdf/circleSDF.glsl"
#include "lygia/sdf/starSDF.glsl"
#include "lygia/animation/easing.glsl"

float wipe(float offset) {
  return map(sin((u_time + offset) * 1.0), .0, 1., .08, .12);
}

void main(){
  //init stuff:
  float ancho = 0.6;

  vec3 color = vec3(0.0);
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec2 st_b = st;
  float cdistance = distance(st, vec2(0.5));
  float mouse_dist = distance(u_mouse / u_resolution, vec2(0.5));
  float size = 1.0 - cdistance * (u_mouse.x / u_resolution.x) + 23.0;
  float sizer = map(-mouse_dist*2.+1., .0, 1., 0., 2.);
  
  //draw!
  st_b = ratio(st_b, u_resolution);
  // st_b = brick(st_b, 4.0);
  st_b = rotate(st_b, sizer * cdistance);

  color += smootherstep(1.0-ancho, ancho, cos(20.0 * starSDF(st_b, 5, wipe(.00))) * .5 +.5);
  // color.g += smootherstep(1.0-ancho, ancho, cos(19.6 * starSDF(st_b, 5, wipe(.03))) * .5 +.5);
  // color.b += smootherstep(1.0-ancho, ancho, cos(19.8 * starSDF(st_b, 5, wipe(.06))) * .5 +.5);
  
  // color *= circleSDF(st_b);
  
  //debug
  color += digits(vec2(st.x - 0.05, st.y-.1), size);
  color += digits(st - 0.05, sizer);
  
  //output:
  gl_FragColor = vec4(vec3(color), 1.0);
}
