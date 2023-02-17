#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define LOOPS 30.0
#define ANCHO 0.48 // <.5

#include "lygia/space/brick.glsl"
#include "lygia/space/ratio.glsl"
#include "lygia/space/rotate.glsl"
#include "lygia/math/map.glsl"
#include "lygia/math/smootherstep.glsl"
#include "lygia/draw/digits.glsl"
#include "lygia/sdf.glsl"
#include "lygia/animation/easing.glsl"

float wipe(float offset) {
  return map(sin((u_time + offset) * 1.0), .0, 1., .08, .12);
}

void main(){
  //init stuff:
  vec3 color = vec3(0.0);
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  float cdistance = distance(st, vec2(0.5));
  float mouse_dist = distance(u_mouse/u_resolution, vec2(0.5));
  float size = 1.0- cdistance*(u_mouse.x/u_resolution.x) + 23.0;
  float sizer = map(-mouse_dist*2.+1., 0.0, 1.0, 0.0, 2.0);
  
  //draw!
  st = ratio(st, u_resolution);
  // st = brick(st, 4.0);
  // st = rotate(st, sizer*cdistance);

  float shape = cos(LOOPS*hexSDF(st))*.5 +.5;
  color += smootherstep(1.0-ANCHO, ANCHO, shape);
  
  //debug
  color += digits(vec2(st.x-0.05, st.y-.1), size);
  color += digits(st-0.05, sizer);
  
  //output:
  gl_FragColor = vec4(vec3(color), 1.0);
}
