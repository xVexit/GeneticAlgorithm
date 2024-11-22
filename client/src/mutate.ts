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
  for (let i = 0; i < vertices.length; i += 6) {
    // random values for cordinates
    if (Math.random() < mutationRate) {
      vertices[i] = getRandom(population, i);
    }
    if (Math.random() < mutationRate) {
      vertices[i + 1] = getRandom(population, i);
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
 * Generates a random value within a specific range
 * @param {number} population - size of population
 * @param {number} index -
 * @returns {number}
 */
export function getRandom(
  population: number,
  index: number,
): number {
  const range = 2 / population;
  const start = -1;
  return Math.random() * range + (index + start);
}
