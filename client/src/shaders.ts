const SHADER_VERSION = "#version 300 es";

export const VERTEX_SHADER_IMAGES = SHADER_VERSION + `
layout(location = 0) in vec2 vertex_position;
layout(location = 1) in vec4 vertex_color;

uniform float triangles;
uniform float population;

out vec4 fragment_color;

void main() {
    float offset = floor(float(gl_VertexID) / triangles / 3.0);
    float width = min(population, 64.0);
    float height = ceil(population / 64.0);

    fragment_color = vertex_color;

    gl_Position = vec4(
        (vertex_position.x + mod(offset, 64.0)) / width * 2.0 - 1.0,
        (vertex_position.y + floor(offset / 64.0)) / height * 2.0 - 1.0,
        0.0,
        1.0
    );
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

vec3 colorAverageFitness(vec2 pixel, vec2 dimensions) {
    vec3 total = vec3(0.0, 0.0, 0.0);

    for(float y = 0.0; y < height; y++) {
        total += abs(
            texture(texture_reference, vec2(fract(pixel.x / width), fract(y / height))).xyz
                - texture(texture_generated, vec2(pixel.x, pixel.y + y) / dimensions).xyz
        );
    }

    return vec3(1.0) - total / height;
}

void main() {
    color = vec4(
        colorAverageFitness(
            gl_FragCoord.xy,
            vec2(
                width * min(population, 64.0),
                height * ceil(population / 64.0)
            )
        ),
        1.0
    );
}
`;
