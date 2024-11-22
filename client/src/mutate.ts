/**
 * Mutates an individual by altering its vertices.
 *
 * @param {Float32Array} individual - the individual to mutate.
 * @param {num} mutationRate - probability of mutation for each vertex
 * @param {num} width - the width of the canvas
 * @param {num} height - the height of the canvas
 * @param {num} population - size of population
 * @returns {Float32Array} - The mutated individual.
 */
export function mutate(
  vertices: Float32Array,
  mutationRate: number,
  population: number,
): Float32Array {
  const verticesPerIndividual = vertices.length / population;
  for (let i = 0; i < vertices.length; i += 6) {
    const offset = Math.floor(i / verticesPerIndividual / 6);
    // random values for cordinates
    if (Math.random() < mutationRate) {
      vertices[i] = getRandomPosition(population,offset);
    }
    if (Math.random() < mutationRate) {
      vertices[i + 1] = getRandomPosition(population, offset);
    }

    // random value for colors
    for (let j = 0; j < 4; j++) {
      if (Math.random() < mutationRate) {
        vertices[j + 2 + i] = Math.random();
      }
    }
  }
  return vertices;
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
  const range = 2 / population;
  const start = -1;
  return Math.random() * range + offset + start;
}
