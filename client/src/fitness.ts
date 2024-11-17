import * as WebGL from "./common/webgl.ts";
import { FRAGMENT_SHADER_FITNESS, VERTEX_SHADER_FITNESS } from "./shaders.ts";

/**
 * Creates a fitness calculation function for a specified population. The fitness
 * will be calculated by rendering images of specified width and height and
 * comparing them to a reference image. The fitness function takes in an array of
 * vertices and computes the fitness values for the population.
 *
 * @param {WebGL.Context} context - The WebGL context used for rendering.
 * @param {number} width - The width of the image in pixels.
 * @param {number} height - The height of the image in pixels.
 * @param {number} triangles - The number of triangles per single invidual.
 * @param {number} population - The number of inviduals.
 * @param {WebGL.Texture} reference - The WebGL texture of the reference image.
 *
 * @returns {function(Float32Array): Float32Array} - The fitness function.
 */
export function createFitnessFunction(
    context: WebGL.Context,
    width: number,
    height: number,
    triangles: number,
    population: number,
): (vertices: Float32Array) => Float32Array {
    // TODO: Implement the rendering and fitness calculation
}

export function createFitnessComputeFunction(
    context: WebGL.Context,
    width: number,
    height: number,
    population: number,
    reference: WebGL.Texture,
    framebuffer?: WebGL.Framebuffer,
): WebGL.ResourceWithDeleteFunction<(generated: WebGL.Texture) => void> {
    const [vertexShader, deleteVertexShader] = WebGL
        .createShader(
            context,
            WebGL.VERTEX_SHADER,
            VERTEX_SHADER_FITNESS,
        );

    const [fragmentShader, deleteFragmentShader] = WebGL
        .createShader(
            context,
            WebGL.FRAGMENT_SHADER,
            FRAGMENT_SHADER_FITNESS,
        );

    const [shaderProgram, deleteShaderProgram] = WebGL
        .createProgram(
            context,
            [
                vertexShader,
                fragmentShader,
            ],
        );

    const uniforms = {
        texture_reference: WebGL
            .selectUniform(context, shaderProgram, "texture_reference"),
        texture_generated: WebGL
            .selectUniform(context, shaderProgram, "texture_generated"),
    };

    const [vertexBuffer, deleteVertexBuffer] = WebGL
        .createBuffer(
            context,
            new Float32Array([
                -1.0,
                -1.0,
                1.0,
                -1.0,
                1.0,
                1.0,

                -1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
            ]),
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
                    stride: 2 * Float32Array.BYTES_PER_ELEMENT,
                },
            ],
        );

    return [
        (generated: WebGL.Texture): void => {
            WebGL.drawArrays(
                context,
                shaderProgram,
                vertexArray,
                6,
                {
                    framebuffer: framebuffer,
                    viewport: {
                        x: 0,
                        y: 0,
                        width: width * population,
                        height: 1,
                    },
                    clear: {
                        color: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                    },
                    textures: [
                        {
                            unit: 0,
                            texture: reference,
                        },
                        {
                            unit: 1,
                            texture: generated,
                        },
                    ],
                    uniforms: [
                        {
                            type: WebGL.UNIFORM_INT,
                            location: uniforms.texture_reference,
                            value: {
                                x: 0,
                            },
                        },
                        {
                            type: WebGL.UNIFORM_INT,
                            location: uniforms.texture_generated,
                            value: {
                                x: 1,
                            },
                        },
                    ],
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
