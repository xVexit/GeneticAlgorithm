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
