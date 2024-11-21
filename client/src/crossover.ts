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
	const vertexSize = 6;
	const vertexCount = parent1.length / vertexSize;

	if (parent1.length !== parent2.length || parent1.length % vertexSize !== 0){
		throw new Error("Parents arrays must have the same length and be divisibe by the vertex size");
	}

	const crossoverPoint = Math.floor(Math.random() * vertexCount);

	const offspring1 = new Float32Array(parent1.length);
	const offspring2 = new Float32Array(parent2.length);

	for (let i = 0; i < vertexCount; i++) {
		for (let j = 0; j < vertexSize; j++){
			const index = i * vertexSize + j;

			if (i < crossoverPoint) {
				offspring1[index] = parent1[index];
				offspring2[index] = parent2[index];
			} else {
				offspring1[index] = parent2[index];
				offspring2[index] = parent1[index];
			}
		}
	}

	return [offspring1, offspring2];
}


const parent1 = new Float32Array([
    10, 20, 1, 0, 0, 1, // Vertex 1
]);

const parent2 = new Float32Array([
    15, 25, 0.5, 0.5, 0.5, 0.5, // Vertex 1
]);

const [offspring1, offspring2] = crossover(parent1, parent2);

console.log(offspring1);
console.log(offspring2);
