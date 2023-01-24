#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;

vec4 fracture(vec2 x){
    return texture2D(u_buffer1, fract((x)/u_resolution));
}

float circle(vec2 coord, float radius) {
    return length(coord) - radius;
}

void main() {
    float waveScale = 1.1;
    float contribution = 0.01; // how much the texture2 texture is affecting the texture1 one
    vec4 color = vec4(0.0);
    vec2 uv = gl_FragCoord.xy/u_resolution;

    vec4 texture1 = texture2D(u_buffer1, uv);
    vec4 texture2 = texture2D(u_buffer0, uv);

#ifdef BUFFER_0
    vec2 coord = (gl_FragCoord.xy/u_resolution);

    // what about getting a color c out of a coordinate?
    // do you remember what swizzling is? if not, look at 013-swizzling.glsl
    //vec4 c = coord.xyxy;

    // Exercise 1. What if you change the coord system?
    vec4 c = (coord*0.75).xxyy * (sin(u_time)) * .5 +.3;
    //vec4 c = (coord * cos(u_time * 0.2)* 2.75).xxyy;

    // How let's use our function "fracture"

    // Exercise 2.
    // Play with the fracture functiom
    //c += fracture(gl_FragCoord.xy + c.xy);
    //c += fracture(gl_FragCoord.xy - c.xy);
    //c += fracture(gl_FragCoord.xy / c.xy);
    //c += fracture(gl_FragCoord.xy-c.xy) * 2.7 -6.;
    //c += fracture(gl_FragCoord.xy-c.xy) * 1.7 -6. * sin(u_time * 0.01) * 3.;
    // c += fracture(gl_FragCoord.xy-c.xy) * cos(u_time * 0.3)*2.7 -3.;

    // Exercise 3. in how many different ways can you mix a and sample again?
    // be creative!
    //c = mix(fracture(gl_FragCoord.xy+c.xy), c, .7);
    //c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).rgba, .5);
    //c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).argb, .2);
    //c = mix(fracture(gl_FragCoord.xy+c.xy)*0.4, fract(c).argb, .2);
    //c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c/vec4(2.7)).argb, .2);
    //c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).argb, .2);
   
    // Exercise 4.
    // Those 3 lines are just a way to combine together, the 3 variables texture1, texture2, and c
    // in the result c.
    // can you try other way to combine them?
    texture1 *= 0.01;
    texture1 += clamp(c, 0., 1.);
    //c = texture2*(contribution) + texture1;

    // END, after this part is nothing texture2, you know it already.
    // If those exercises where not enough, try to draw something that is not a circle

    // draw and animate a simple circle as we already did many times in class
    vec2 offset = vec2(sin(u_time*2.) * 0.95+.1, cos(u_time)) * 0.45 - .5;
    float cir = circle(coord + offset, .15);
    vec4 circle = vec4(vec3(cir), .9);

    gl_FragColor = c/circle;
    // what is happening exactly? try debug the coordinate system
    // simply printing it in the BUFFER_0 section
    // gl_FragColor = c;

#elif defined( BUFFER_1 )
    gl_FragColor = texture2D(u_buffer0, uv);

#else
    gl_FragColor = texture2D(u_buffer1, uv);
#endif
}