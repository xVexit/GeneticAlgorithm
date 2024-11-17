/**
 * Performs one-point crossover between two individuals
 *
 * @param {Float32Array} parent1 - The first parent
 * @param {Float32Array} parent2 - The secont parent
 * @returns {[Float32Array, Float32Array]} - Two offspring
 */
export function crossover(
	parent1: Float32Array,
	parent2: Float32Array
): [Float32Array, Float32Array] {
	const length = parent1.length;
	const crossoverPoint = Math.floor(Math.random() * (length / 2)) * 2;

	const offspring1 = new Float32Array(length);
	const offspring2 = new Float32Array(length);

	for (let i = 0; i < length; i++) {
		if (i < crossoverPoint) {
			offspring1[i] = parent1[i];
			offspring2[i] = parent2[i];
		} else {
			offspring1[i] = parent2[i];
			offspring2[i] = parent1[i];
		}
	}

	return [offspring1, offspring2];
}
