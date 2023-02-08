#ifdef GL_ES
precision mediump float;
#endif

uniform vec2        u_resolution;
uniform float       u_time;

vec4 mainimage() {
	//init stuff:
	vec2 u = gl_FragCoord.xy;
	vec2 R = u_resolution.xy,
       U = u+u - R;  

    float f = 2.307, // Golden Angle 2.4 ok too
          s = 15./R.y,
         PI = 3.14, L = 2.*PI/f,
          a = atan(-U.y,U.x), l = length(U)*s, 
         x1 =  a / f,
         x2 = l*l,
          k = floor((x2-x1)/L + .5),
          x = floor(x1 + L*k + .5);

    vec4 O = vec4( x > 2e2 ? 0. :
              2.-.5* length( U - sqrt(x) *cos ( x * f  + vec2(0,PI/2.)) / s )  );  

	return O;
}

void main(){
	//output:
	gl_FragColor = vec4(vec3(mainimage().rgb), 1.0);
}