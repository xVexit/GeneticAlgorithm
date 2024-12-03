import * as WebGL from "./common/webgl.ts";

import { createFitnessFunction } from "./fitness.ts";
import { mutate } from "./mutate.ts";
import { crossover } from "./crossover.ts";

/**
 * An interface containing the algotihm function and the delete function.
 * @typedef AlgorithmFunction
 * @property call - A method that performs the training.
 * @property delete - A method that releases the resources.
 */
export type AlgorithmFunction = {
  call: () => [Float32Array, Float32Array];
  delete: () => void;
};

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
 * @param {number} tournament - The tournament samples.
 * @param {HTMLImageElement} reference - The WebGL texture of the reference image.
 *
 * @throws When is unable to create WebGL resources.
 * @returns {AlgorithmFunction} The algorithm function with the delete function.
 */
export function createAlgorithmFunction(
  context: WebGL.Context,
  width: number,
  height: number,
  triangles: number,
  population: number,
  mutation: number,
  tournament: number,
  reference: HTMLImageElement,
): AlgorithmFunction {
  const vertices = new Float32Array(population * triangles * TRIANGLE_LENGTH);
  for (let i = 0; i < vertices.length; i++) {
    vertices[i] = Math.random();
  }

  const [texture, deleteTexture] = WebGL
    .createTextureFromImage(
      context,
      reference,
      {
        filters: {
          minifying: WebGL.NEAREST,
          magnifying: WebGL.NEAREST,
        },
      },
    );

  const { call: callFitnessFunction, delete: deleteFitnessFunction } =
    createFitnessFunction(
      context,
      width,
      height,
      triangles,
      population,
      texture,
    );

  return {
    call: (): [Float32Array, Float32Array] => {
      const verticesParents = new Float32Array(vertices);
      const fitness = callFitnessFunction(vertices);
      const winnerOffset = Math.floor(selectWithHighestFitness(fitness)) *
        triangles * TRIANGLE_LENGTH;

      if (winnerOffset != 0) {
        for (let i = 0; i < triangles * TRIANGLE_LENGTH; i++) {
          vertices[i] = verticesParents[winnerOffset + i];
        }
      }

      for (let i = 1; i < population; i++) {
        crossover(
          verticesParents,
          vertices,
          selectWithTournament(fitness, tournament),
          selectWithTournament(fitness, tournament),
          i,
          triangles,
        );
        mutate(
          vertices,
          i,
          triangles,
          mutation,
        );
      }

      return [fitness, vertices];
    },
    delete: (): void => {
      deleteTexture();
      deleteFitnessFunction();
    },
  };
}

function selectWithHighestFitness(fitness: Float32Array): number {
  let winnerIndex = 0;

  for (let i = 1; i < fitness.length; i++) {
    if (fitness[i] >= fitness[winnerIndex]) {
      winnerIndex = i;
    }
  }

  return winnerIndex;
}

function selectWithTournament(fitness: Float32Array, samples: number): number {
  let winnerIndex = Math.floor(Math.random() * (fitness.length - 1));

  for (let i = 1; i < samples; i++) {
    const index = Math.floor(Math.random() * (fitness.length - 1));
    if (fitness[index] >= fitness[winnerIndex]) {
      winnerIndex = index;
    }
  }

  return winnerIndex;
}
