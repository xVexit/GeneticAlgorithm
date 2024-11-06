import * as WebGL from "./common/webgl.ts"

/**
 * Creates a fitness calculation function for a specified population. The fitness
 * will be calculated by rendering images of specified width and height and
 * comparing them to a target image. The fitness function takes in an array of
 * vertices and computes the fitness values for the population.
 *
 * @param {WebGL.Context} context - The WebGL context used for rendering.
 * @param {number} width - The width of the image in pixels.
 * @param {number} height - The height of the image in pixels.
 * @param {number} triangles - The number of triangles per single invidual.
 * @param {number} population - The number of inviduals.
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
