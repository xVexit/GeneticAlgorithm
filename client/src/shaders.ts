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

vec3 colorAverageFitness(int x, int texture_reference_width, int texture_generated_height) {
    vec3 total = vec3(0.0, 0.0, 0.0);

    for (int y = 0; y < texture_generated_height; y++) {
        total += abs(
            texelFetch(texture_reference, ivec2(x % texture_reference_width, y), 0).xyz
                - texelFetch(texture_generated, ivec2(x, y), 0).xyz
        );
    }

    return vec3(1.0) - total / float(texture_generated_height);
}

void main() {
    color = vec4(
        colorAverageFitness(
            int(gl_FragCoord.x),
            textureSize(texture_reference, 0).x,
            textureSize(texture_generated, 0).y
        ),
        1.0
    );
}
`;
