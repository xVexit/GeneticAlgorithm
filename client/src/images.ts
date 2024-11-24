import * as WebGL from "./common/webgl.ts";
import { FRAGMENT_SHADER_IMAGES, VERTEX_SHADER_IMAGES } from "./shaders.ts";

/**
 * An interface containing the render function and the delete function.
 * @typedef RenderFunction
 * @property call - A method that performs the rendering.
 * @property delete - A method that releases the resources.
 */
export type RenderFunction = {
  call: (data: Float32Array) => void;
  delete: () => void;
};

/**
 * Creates a function rendering triangles to the specified framebuffer.
 *
 * @param {WebGL.Context} context - The WebGL context used for rendering.
 * @param {number} width - The width of the viewport in pixels.
 * @param {number} height - The height of the viewport in pixels.
 * @param {nubmer} triangles - The number of triangles.
 * @param {nubmer} population - The number of inviduals.
 * @param {WebGL.Framebuffer} framebuffer - The WebGL framebuffer used for rendering.
 *
 * @throws When is unable to create WebGL resources.
 * @returns { RenderFunction } The render function with the delete function.
 */
export function createRenderFunction(
  context: WebGL.Context,
  width: number,
  height: number,
  triangles: number,
  population: number,
  framebuffer?: WebGL.Framebuffer,
): RenderFunction {
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

  const uniforms = {
    triangles: WebGL
      .selectUniform(context, shaderProgram, "triangles"),
    population: WebGL
      .selectUniform(context, shaderProgram, "population"),
  };

  const [vertexBuffer, deleteVertexBuffer] = WebGL
    .createBuffer(
      context,
      triangles * population * 18 * Float32Array.BYTES_PER_ELEMENT,
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

  return {
    call: (data: Float32Array): void => {
      WebGL.updateBuffer(context, vertexBuffer, data);
      WebGL.drawArrays(
        context,
        shaderProgram,
        vertexArray,
        triangles * population * 3,
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
          uniforms: [
            {
              type: WebGL.UNIFORM_FLOAT,
              location: uniforms.triangles,
              value: {
                x: triangles,
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
