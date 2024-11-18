import * as WebGL from "./common/webgl.ts";
import { createImagesRenderFunction } from "./images.ts";
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
 * @throws When is unable to create WebGL resoureces.
 * @returns {WebGL.ResourceWithDeleteFunction<(vertices: Float32Array) => Float32Array>}
 */
export function createFitnessFunction(
    context: WebGL.Context,
    width: number,
    height: number,
    triangles: number,
    population: number,
    reference: WebGL.Texture,
): WebGL.ResourceWithDeleteFunction<(vertices: Float32Array) => Float32Array> {
    const [textureImages, deleteTextureImages] = WebGL
        .createTexture(
            context,
            width * population,
            height,
            {
                format: WebGL.RGBA,
                filters: {
                    minifying: WebGL.NEAREST,
                    magnifying: WebGL.NEAREST,
                },
            },
        );

    const [framebufferImages, deleteFramebufferImages] = WebGL
        .createFramebuffer(
            context,
            [
                {
                    index: 0,
                    texture: textureImages,
                },
            ],
        );

    const [textureFitness, deleteTextureFitness] = WebGL
        .createTexture(
            context,
            width * population,
            1,
            {
                format: WebGL.RGBA,
                filters: {
                    minifying: WebGL.NEAREST,
                    magnifying: WebGL.NEAREST,
                },
            },
        );

    const [framebufferFitness, deleteFramebufferFitness] = WebGL
        .createFramebuffer(
            context,
            [
                {
                    index: 0,
                    texture: textureFitness,
                },
            ],
        );

    const [callImagesRenderFunction, deleteImagesRenderFunction] =
        createImagesRenderFunction(
            context,
            width * population,
            height,
            triangles * 3,
            framebufferImages,
        );

    const [callFitnessComputeFunction, deleteFitnessComputeFunction] =
        createFitnessComputeFunction(
            context,
            width,
            height,
            population,
            reference,
            framebufferFitness,
        );

    const setupFitnessFromPixels = (pixels: Uint8Array): Float32Array => {
        const fitness: Float32Array = new Float32Array(population);

        for (let i = 0; i < population; i++) {
            for (let j = 0; j < width * 4; j++) {
                if (j % 4 < 3) {
                    fitness[i] += pixels[j + i * (width * 4)] / (width * 3);
                }
            }
        }

        return fitness;
    };

    return [
        (vertices: Float32Array): Float32Array => {
            callImagesRenderFunction(vertices);
            callFitnessComputeFunction(textureImages);

            return setupFitnessFromPixels(
                WebGL.selectPixels(
                    context,
                    framebufferFitness,
                    width * population,
                    1,
                    {
                        type: WebGL.UNSIGNED_BYTE,
                        format: WebGL.RGBA,
                    },
                ),
            );
        },
        (): void => {
            deleteImagesRenderFunction();
            deleteTextureImages();
            deleteFramebufferImages();
            deleteFitnessComputeFunction();
            deleteTextureFitness();
            deleteFramebufferFitness();
        },
    ];
}

/**
 * Creates a fitness compute function that evaluates fitness values of the generated
 * texture. The function renders an image containing vertically averaged fitness values.
 *
 * @param {WebGL.Context} context - The WebGL context used for rendering.
 * @param {number} width - The width of the image in pixels.
 * @param {number} height - The height of the image in pixels.
 * @param {number} population - The number of inviduals.
 * @param {WebGL.Texture} reference - The WebGL texture of the reference image.
 * @param {WebGL.Framebuffer} framebuffer - The WebGL framebuffer used for rendering.
 *
 * @throws When is unable to create WebGL resoureces.
 * @returns {WebGL.ResourceWithDeleteFunction<(generated: WebGL.Texture) => void>}
 */
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
