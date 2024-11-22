/**
 * Performs one-point crossover between two individuals
 *
 * @param {Float32Array} parent1 - The first parent
 * @param {Float32Array} parent2 - The secont parent
 * @returns { Float32Array } - offspring
 */
export function crossover(
  parent1: Float32Array,
  parent2: Float32Array,
): Float32Array {
  if (parent1.length !== parent2.length) {
    throw new Error(
      "Parents arrays must have the same length ",
    );
  }

  const crossoverPoint = Math.floor(Math.random() * parent1.length);

  const offspring = new Float32Array(parent1.length);

  for (let i = 0; i < parent1.length; i++) {
    if (i < crossoverPoint) {
      offspring[i] = parent1[i];
    } else {
      offspring[i] = parent2[i];
    }
  }
  return offspring;
}
