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

vec3 colorDifferenceAverage(in vec2 pixel, in ivec2 dimensions) {
    vec4 total = vec4(0.0, 0.0, 0.0, 0.0);

    for(int y = 0; y < dimensions.y; y++) {
        total += abs(
            texelFetch(texture_reference, ivec2(pixel.x, y), 0)
                - texelFetch(texture_generated, ivec2(pixel.x, y), 0)
        );
    }

    return total.xyz / float(dimensions.y);
}

void main() {
    color = vec4(
        colorDifferenceAverage(
            gl_FragCoord.xy,
            textureSize(texture_generated, 0)
        ), 
        1.0
    );
}
`;
