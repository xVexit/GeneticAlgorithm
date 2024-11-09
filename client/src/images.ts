import * as WebGL from "./common/webgl.ts";
import { FRAGMENT_SHADER_IMAGES, VERTEX_SHADER_IMAGES } from "./shaders.ts";

export function createRenderFunction(
    context: WebGL.Context,
    width: number,
    height: number,
    vertices: number,
    framebuffer?: WebGL.Framebuffer,
): WebGL.ResourceWithDeleteFunction<(data: Float32Array) => void> {
    const [vertexShader, deleteVertexShader] = WebGL
        .createShader(
            context,
            WebGL.VERTEX_SHADER,
            VERTEX_SHADER_IMAGES,
        );

    const [fragmentShader, deleteFragmentShader] = WebGL
        .createShader(
            context,
            WebGL.FRAGMENT_SHADER,
            FRAGMENT_SHADER_IMAGES,
        );

    const [shaderProgram, deleteShaderProgram] = WebGL
        .createProgram(
            context,
            [
                vertexShader,
                fragmentShader,
            ],
        );

    const [vertexBuffer, deleteVertexBuffer] = WebGL
        .createBuffer(
            context,
            vertices * 6 * Float32Array.BYTES_PER_ELEMENT,
            {
                type: WebGL.ARRAY_BUFFER,
                usage: WebGL.DYNAMIC_DRAW,
            },
        );

    const [vertexArray, deleteVertexArray] = WebGL
        .createVertexArray(
            context,
            [
                {
                    index: 0,
                    size: 2,
                    buffer: vertexBuffer,
                    offset: 0,
                    stride: 6 * Float32Array.BYTES_PER_ELEMENT,
                },
                {
                    index: 1,
                    size: 4,
                    buffer: vertexBuffer,
                    offset: 2 * Float32Array.BYTES_PER_ELEMENT,
                    stride: 6 * Float32Array.BYTES_PER_ELEMENT,
                },
            ],
        );

    return [
        (data: Float32Array): void => {
            WebGL.updateBuffer(context, vertexBuffer, data);
            WebGL.drawArrays(
                context,
                shaderProgram,
                vertexArray,
                vertices,
                {
                    framebuffer: framebuffer,
                    viewport: {
                        width: width,
                        height: height,
                    },
                    clear: {
                        color: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                    },
                },
            );
        },
        (): void => {
            deleteVertexShader();
            deleteFragmentShader();
            deleteVertexArray();
            deleteVertexBuffer();
            deleteShaderProgram();
        },
    ];
}
