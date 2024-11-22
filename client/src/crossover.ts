/**
 * Performs one-point crossover between two individuals
 *
 * @param {Float32Array} parent1 - The first parent
 * @param {Float32Array} parent2 - The secont parent
 * @returns { Float32Array } - Two offspring
 */
export function crossover(
	parent1: Float32Array,
	parent2: Float32Array
): Float32Array {
	const vertexSize = 6;
	const vertexCount = parent1.length / vertexSize;

	if (parent1.length !== parent2.length || parent1.length % vertexSize !== 0){
		throw new Error("Parents arrays must have the same length and be divisibe by the vertex size");
	}

	const crossoverPoint = Math.floor(Math.random() * vertexCount);

	const offspring = new Float32Array(parent1.length);

	for (let i = 0; i < vertexCount; i++) {
		for (let j = 0; j < vertexSize; j++){
			const index = i * vertexSize + j;
			
			if (i < crossoverPoint){
				offspring[index] = parent1[index];
			} else {
				offspring[index] = parent2[index];
			}
			}
		}
	return offspring;
	}

