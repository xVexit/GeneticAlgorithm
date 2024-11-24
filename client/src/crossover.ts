/**
 * Performs a crossover between two individuals and produces a single offspring.
 *
 * @param {Float32Array} population - The array representing the entire population.
 * @param {number} indexA - The index of the first parent in the population.
 * @param {number} indexB - The index of the second parent in the population.
 * @param {number} indexOutput - The index where the offspring will be stored.
 * @param {number} trianglesPerIndividual - The number of triangles per individual.
 * @returns {Float32Array} - The updated population array with the offspring added.
 */
export function crossover(
  population: Float32Array,
  indexA: number,
  indexB: number,
  indexOutput: number,
  trianglesPerIndividual: number,
): Float32Array {
  const VERTEX_LENGTH = 6;
  const TRIANGLE_LENGTH = 18;
  const individualSize = TRIANGLE_LENGTH * trianglesPerIndividual;

  const startA = indexA * individualSize;
  const startB = indexB * individualSize;
  const startOutput = indexOutput * individualSize;

  const parentAOffset = indexA / population.length * 2.0 - 1.0;
  const parentBOffset = indexB / population.length * 2.0 - 1.0;
  const outputOffset = indexOutput / population.length * 2.0 - 1.0;

  const crossoverPoint = Math.floor(Math.random() * (individualSize - 1));

  for (let i = 0; i < individualSize; i++) {
    const geneIndex = i % VERTEX_LENGTH;
    if (i < crossoverPoint) {
      switch (geneIndex) {
        case 0:
          population[startOutput + i] = population[startA + i] - parentAOffset +
            outputOffset;
          break;
        default:
          population[startOutput + i] = population[startA + i];
      }
    } else {
      switch (geneIndex) {
        case 0:
          population[startOutput + i] = population[startB + i] - parentBOffset +
            outputOffset;
          break;
        default:
          population[startOutput + i] = population[startB + i];
      }
    }
  }
  return population;
}
