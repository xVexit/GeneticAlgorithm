/**
 * Mutates all vertices (x, y, r, g, b, a) in a single individual using getRandomPosition.
 *
 * @param {Float32Array} population - The array representing the entire population.
 * @param {number} index - The index of the individual to mutate.
 * @param {number} triangles - Number of triangles per individual.
 * @param {number} mutationRate - Probability of mutation for each gene.
 * @param {number} populationSize - Total number of individuals in the population.
 * @returns {Float32Array} - The updated population array with the mutated individual.
 */
export function mutate(
  population: Float32Array,
  index: number,
  triangles: number,
  mutationRate: number,
  populationSize: number,
): Float32Array {
  const TRIANGLE_LENGTH = 18;
  const VERTEX_LENGTH = 6;
  const individualOffset = index * triangles * TRIANGLE_LENGTH;

  for (let j = 0; j < triangles * TRIANGLE_LENGTH; j++) {
    if (Math.random() < mutationRate) {
      const geneIndex = j % VERTEX_LENGTH;
      const vertexOffset = individualOffset + j;

      switch (geneIndex) {
        case 0:
          population[vertexOffset] = getRandomPosition(populationSize, index);
          break;
        case 1:
          population[vertexOffset] = Math.random() * 2 - 1;
          break;
        default:
          population[vertexOffset] = Math.random();
          break;
      }
    }
  }
  return population;
}

/**
 * Generates a random position within a specific range for an individual
 * in a population, based on the size of the population and the individual's offset.
 *
 * Each individual is assigned a unique segment of the range [-1, 1] based on the
 * total population size. This function calculates the segment for the given
 * individual and generates a random value within that segment.
 *
 * @param {number} population - The total size of the population. Determines the width of each individual's range.
 * @param {number} offset - The index or position of the individual within the population. Determines the segment's offset.
 * @returns {number} - A random position within the range assigned to the individual.
 *
 * Example:
 * For a population of 4:
 * - Individual 0 (offset = 0) gets range [-1, -0.5)
 * - Individual 1 (offset = 1) gets range [-0.5, 0)
 * - Individual 2 (offset = 2) gets range [0, 0.5)
 * - Individual 3 (offset = 3) gets range [0.5, 1)
 */
export function getRandomPosition(
  population: number,
  offset: number,
): number {
  return (Math.random() + offset) / population * 2 - 1;
}
