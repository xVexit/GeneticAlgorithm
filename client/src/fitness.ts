import * as WebGL from "./common/webgl.ts";

import { createRenderFunction } from "./images.ts";
import { FRAGMENT_SHADER_FITNESS, VERTEX_SHADER_FITNESS } from "./shaders.ts";

/**
 * An interface containing the fitness function and the delete function.
 * @typedef FitnessFunction
 * @property call - A method that performs the fitness calculations.
 * @property delete - A method that releases the resources.
 */
export type FitnessFunction = {
  call: (vertices: Float32Array) => Float32Array;
  delete: () => void;
};

/**
 * An interface containing the compute function and the delete function.
 * @typedef RenderFunction
 * @property call - A method that performs the computing.
 * @property delete - A method that releases the resources.
 */
export type ComputeFunction = {
  call: (generated: WebGL.Texture) => void;
  delete: () => void;
};

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
 * @returns {FitnessFunction} The fitness function with the delete function.
 */
export function createFitnessFunction(
  context: WebGL.Context,
  width: number,
  height: number,
  triangles: number,
  population: number,
  reference: WebGL.Texture,
): FitnessFunction {
  const matrixWidth = Math.min(population, 64);
  const matrixHeight = Math.ceil(population / 64);

  const [textureImages, deleteTextureImages] = WebGL
    .createTexture(
      context,
      width * matrixWidth,
      height * matrixHeight,
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
      width * matrixWidth,
      matrixHeight,
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

  const { call: callRenderFunction, delete: deleteRenderFunction } =
    createRenderFunction(
      context,
      width * matrixWidth,
      height * matrixHeight,
      triangles,
      population,
      framebufferImages,
    );

  const { call: callComputeFunction, delete: deleteComputeFunction } =
    createComputeFunction(
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

  return {
    call: (vertices: Float32Array): Float32Array => {
      callRenderFunction(vertices);
      callComputeFunction(textureImages);

      return setupFitnessFromPixels(
        WebGL.selectPixels(
          context,
          framebufferFitness,
          width * matrixWidth,
          matrixHeight,
          {
            type: WebGL.UNSIGNED_BYTE,
            format: WebGL.RGBA,
          },
        ),
      );
    },
    delete: (): void => {
      deleteRenderFunction();
      deleteTextureImages();
      deleteFramebufferImages();
      deleteComputeFunction();
      deleteTextureFitness();
      deleteFramebufferFitness();
    },
  };
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
 * @returns {ComputeFunction} The compute function with the delete function.
 */
export function createComputeFunction(
  context: WebGL.Context,
  width: number,
  height: number,
  population: number,
  reference: WebGL.Texture,
  framebuffer?: WebGL.Framebuffer,
): ComputeFunction {
  const matrixWidth = Math.min(population, 64);
  const matrixHeight = Math.ceil(population / 64);

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
    width: WebGL
      .selectUniform(context, shaderProgram, "width"),
    height: WebGL
      .selectUniform(context, shaderProgram, "height"),
    population: WebGL
      .selectUniform(context, shaderProgram, "population"),
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

  return {
    call: (generated: WebGL.Texture): void => {
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
            width: width * matrixWidth,
            height: matrixHeight,
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
            {
              type: WebGL.UNIFORM_FLOAT,
              location: uniforms.width,
              value: {
                x: width,
              },
            },
            {
              type: WebGL.UNIFORM_FLOAT,
              location: uniforms.height,
              value: {
                x: height,
              },
            },
            {
              type: WebGL.UNIFORM_FLOAT,
              location: uniforms.population,
              value: {
                x: population,
              },
            },
          ],
        },
      );
    },
    delete: (): void => {
      deleteVertexShader();
      deleteFragmentShader();
      deleteVertexArray();
      deleteVertexBuffer();
      deleteShaderProgram();
    },
  };
}
