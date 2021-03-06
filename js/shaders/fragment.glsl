
uniform float time;
uniform float progress;
uniform float distanceFromCenter;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vertexUv;
varying vec3 vertextPosition;
float PI = 3.141592653589793238;

void main(){

    vec4 t = texture2D(texture1, vertexUv);
    float BW = (t.r + t.b + t.g)/3.;
    vec4 another = vec4(BW, BW, BW, 1.);
    gl_FragColor = mix(another, t, distanceFromCenter);
    gl_FragColor.a = clamp(distanceFromCenter, 0.2, 1.);
}