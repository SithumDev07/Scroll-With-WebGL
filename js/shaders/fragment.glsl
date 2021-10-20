
uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vertexUv;
varying vec3 vertextPosition;
float PI = 3.141592653589793238;

void main(){

    vec4 t = texture2D(texture1, vertexUv);

    gl_FragColor = t;
}