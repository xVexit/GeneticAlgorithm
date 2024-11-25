/**
 * Performs a crossover between two individuals and produces a single offspring.
 *
 * @param {Float32Array} population_input - The array representing the entire population.
 * @param {Float32Array} population_output - The index where the offspring will be stored.
 * @param {number} indexA - The index of the first parent in the population.
 * @param {number} indexB - The index of the second parent in the population.
 * @param {number} trianglesPerIndividual - The number of triangles per individual.
 * @returns {Float32Array} - The updated population array with the offspring added.
 */
export function crossover(
  population_input: Float32Array,
  population_output: Float32Array,
  indexA: number,
  indexB: number,
  trianglesPerIndividual: number,
): Float32Array {
  const VERTEX_LENGTH = 6;
  const TRIANGLE_LENGTH = VERTEX_LENGTH * 3;
  const individualSize = TRIANGLE_LENGTH * trianglesPerIndividual;

  const startA = indexA * individualSize;
  const startB = indexB * individualSize;

  const crossoverPoint = Math.floor(Math.random() * (individualSize - 1));

  for (let i = 0; i < individualSize; i++) {
    if (i < crossoverPoint) {
      population_output[i] = population_input[startA + i];
    } else {
      population_output[i] = population_input[startB + i];
    }
  }
  return population_output;
}
