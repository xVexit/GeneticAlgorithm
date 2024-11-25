/**
 * Mutates all vertices (x, y, r, g, b, a) in a single individual using getRandomPosition.
 *
 * @param {Float32Array} population - The array representing the entire population.
 * @param {number} index - The index of the individual to mutate.
 * @param {number} triangles - Number of triangles per individual.
 * @param {number} mutationRate - Probability of mutation for each gene.
 * @returns {Float32Array} - The updated population array with the mutated individual.
 */
export function mutate(
  population: Float32Array,
  index: number,
  triangles: number,
  mutationRate: number,
): void {
  const VERTEX_LENGTH = 6;
  const TRIANGLE_LENGTH = VERTEX_LENGTH * 3;
  const individualOffset = index * triangles * TRIANGLE_LENGTH;

  for (let j = 0; j < triangles * TRIANGLE_LENGTH; j++) {
    if (Math.random() < mutationRate) {
      const vertexOffset = individualOffset + j;
      population[vertexOffset] = Math.random();
    }
  }
}
