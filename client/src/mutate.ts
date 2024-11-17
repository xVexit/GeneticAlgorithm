/**
 * Mutates an individual by altering its vertices.
 *
 * @param {Float32Array} individual - the individual to mutate.
 * @param {num} mutationRate - probability of mutation for each vertex
 * @param {num} width - the width of the canvas
 * @param {num} height - the height of the canvas
 * @returns {Float32Array} - The mutated individual.
 */
export function mutate(
	individual: Float32Array,
	mutationRate: number,
	width: number,
	height: number,
): Float32Array {
	const mutated = individual.slice();
	for (let i = 0; i < mutated.length; i += 2){
		if (Math.random() < mutationRate){
			mutated[i] = Math.max(0, Math.min(width, mutated[i] + (Math.random() - 0.5) * 20));
		}
		if (Math.random() < mutationRate) {
			mutated[i + 1] = Math.max(0, Math.min(height, mutated[i + 1] + (Math.random() - 0.5) * 20));
		}
	 }
	 return mutated;
}
