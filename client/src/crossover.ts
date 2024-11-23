/**
 * Performs one-point crossover between two individuals within a shared vertices array.
 *
 * @param {Float32Array} vertices - A shared array containing all individuals.
 * @param {number} indexA - The index of the first parent.
 * @param {number} indexB - The index of the second parent.
 * @param {number} indexOutput - The index where the offspring will be stored.
 * @returns {Float32Array} - The updated vertices array with the offspring.
 */
export function crossover(
  vertices: Float32Array,
  indexA: number,
  indexB: number,
  indexOutput: number,
): Float32Array {
  const vertexSize = 6;

  const startA = indexA * vertexSize;
  const startB = indexB * vertexSize;
  const startOutput = indexOutput * vertexSize;

  const crossoverPoint = Math.floor(Math.random() * vertexSize);

  for (let i = 0; i < vertexSize; i++) {
    if (i < crossoverPoint) {
      vertices[startOutput + i] = vertices[startA + i];
    } else {
      vertices[startOutput + i] = vertices[startB + i];
    }
  }
  return vertices;
}
