import * as WebGL from "./common/webgl.ts";

import { createFitnessFunction } from "./fitness.ts";

export const VERTEX_LENGTH = 6;
export const TRIANGLE_LENGTH = VERTEX_LENGTH * 3;

/**
 * Creates a function that changes values of vertices to match a reference image.
 *
 * @param {WebGL.Context} context - The WebGL context used for fitness calculation.
 * @param {number} width - The width of the image in pixels.
 * @param {number} height - The height of the image in pixels.
 * @param {number} triangles - The number of triangles per single invidual.
 * @param {number} population - The number of inviduals.
 * @param {number} mutation - The mutation rate.
 * @param {number} elimination - The elimination rate.
 * @param {WebGL.Texture} reference - The WebGL texture of the reference image.
 *
 * @throws When is unable to create WebGL resources.
 * @returns {WebGL.ResourceWithDeleteFunction<() => Float32Array>} The algorithm function with the delete function.
 */
export function createAlgorithmFunction(
  context: WebGL.Context,
  width: number,
  height: number,
  triangles: number,
  population: number,
  mutation: number,
  elimination: number,
  reference: WebGL.Texture,
): WebGL.ResourceWithDeleteFunction<() => Float32Array> {
  const [callFitnessFunction, deleteFitnessFunction] = createFitnessFunction(
    context,
    width,
    height,
    triangles,
    population,
    reference,
  );

  const vertices: Float32Array = createVertices(
    triangles,
    population,
  );

  return [
    (): Float32Array => {
      const fitness = callFitnessFunction(vertices);
      const threshold = selectFitnessEliminationThreshold(fitness, elimination);

      for (let i = 0; i < population; i++) {
        if (fitness[i] < threshold) {
          // TODO: Launch the crossover and mutation!
        }
      }

      return vertices;
    },
    (): void => {
      deleteFitnessFunction();
    },
  ];
}

function selectFitnessEliminationThreshold(
  array: Float32Array,
  elimination: number,
): number {
  return [...array].sort((a, b) => b - a)[array.length * elimination];
}

function createVertices(triangles: number, population: number): Float32Array {
  const vertices = new Float32Array(triangles * population * TRIANGLE_LENGTH);

  for (let i = 0; i < population; i++) {
    const offset = i * triangles * TRIANGLE_LENGTH;
    for (let j = 0; j < triangles * TRIANGLE_LENGTH; j++) {
      switch (j % VERTEX_LENGTH) {
        case 0:
          vertices[offset + j] = (Math.random() + i) / population * 2.0 - 1.0;
          break;
        case 1:
          vertices[offset + j] = Math.random() * 2.0 - 1.0;
          break;
        default:
          vertices[offset + j] = Math.random();
          break;
      }
    }
  }

  return vertices;
}
