#ifdef GL_ES
precision mediump float;
#endif

uniform float       u_time;
uniform vec3        u_camera;
uniform vec3        u_light;
uniform vec3        u_lightColor;

uniform vec2        u_resolution;

varying vec2        v_texcoord;

#define LIGHT_DIRECTION     u_light
#define RESOLUTION          u_resolution

// #define RAYMARCH_SAMPLES 100
// #define RAYMARCH_MULTISAMPLE 4
// #define LIGHT_COLOR         vec3(0.95, 0.65, 0.5)
#define RAYMARCH_BACKGROUND ( vec3(0.7, 0.2, 0.7) + ray.y * 0.8 )
#define RAYMARCH_AMBIENT    vec3(0.6, 0.1, 0.3)
#define SDF_MIX 0.8
#define SDF_SIZE 0.9
#define U_SPEED 0.2

#include "lygia/space/ratio.glsl"
#include "lygia/math/map.glsl"
#include "lygia/draw/digits.glsl"
#include "lygia/sdf.glsl"
#include "lygia/lighting/raymarch.glsl"
#include "lygia/color/space/linear2gamma.glsl"

float wave(float offset) {
  return sin(u_time*U_SPEED+offset);
} 

float wave(float offset, float speed) {
  return sin(u_time*U_SPEED*speed+offset);
} 

vec4 raymarchMap( in vec3 pos ) {
    vec4 res = vec4(1.0);
    
    res = opUnion(res, vec4(0.0, 1.0, 1.0, sphereSDF(pos-vec3( wave(0.0), wave(1.6,2.), 0.0), SDF_SIZE)));
    res = opUnion(res, vec4(1.0, 0.0, 1.0, sphereSDF(pos-vec3( wave(2.5), wave(2.6), 0.0), SDF_SIZE+0.2)), SDF_MIX);
    res = opUnion(res, vec4(1.0, 1.0, 0.0, sphereSDF(pos-vec3( wave(1.5), wave(3.6), 0.0), SDF_SIZE+0.1)), SDF_MIX);
    
    return res;
}

void main(){
  //init stuff:
  // vec3 u_cameraB = vec3(56.5733,50.449,47.523);
  vec3 color = vec3(0.0);
  vec2 st = v_texcoord;
  vec2 uv = ratio(st, u_resolution);

  color = raymarch(u_camera, uv).rgb;
  color = linear2gamma(color);

  gl_FragColor = vec4( color, 1.0 );
}
