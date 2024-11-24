const SHADER_VERSION = "#version 300 es";

export const VERTEX_SHADER_IMAGES = SHADER_VERSION + `
layout(location = 0) in vec2 vertex_position;
layout(location = 1) in vec4 vertex_color;

out vec4 fragment_color;

void main() {
    fragment_color = vertex_color;
    gl_Position = vec4(vertex_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_IMAGES = SHADER_VERSION + `
precision mediump float;

layout(location = 0) out vec4 color;

in vec4 fragment_color;

void main() {
    color = fragment_color;
}
`;

export const VERTEX_SHADER_FITNESS = SHADER_VERSION + `
layout(location = 0) in vec2 vertex_position;

void main() {
    gl_Position = vec4(vertex_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_FITNESS = SHADER_VERSION + `
precision mediump float;

layout(location = 0) out vec4 color;

uniform sampler2D texture_reference;
uniform sampler2D texture_generated;
uniform float width;
uniform float height;
uniform float population;

vec3 colorAverageFitness(float x) {
    vec3 total = vec3(0.0, 0.0, 0.0);

    for(float y = 0.0; y < height; y++) {
        total += abs(
            texture(texture_reference, vec2(fract(x / width), 1.0 - y / height)).xyz
                - texture(texture_generated, vec2(x / width / population, y / height)).xyz
        );
    }

    return vec3(1.0) - total / height;
}

void main() {
    color = vec4(colorAverageFitness(gl_FragCoord.x), 1.0);
}
`;
