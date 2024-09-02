import { AnnoyIndex } from "annoy"

import { VECTOR_DIMENSIONS } from "../schema/keywordVector"

// Define the number of dimensions for your embeddings

// Create an Annoy index with the specified dimension and distance metric
const annoyIndex = new AnnoyIndex(VECTOR_DIMENSIONS, "angular") // 'angular' is for cosine similarity

// Variable to keep track of the next available index ID
let nextIndexId = 0

// Function to add embeddings to the Annoy index
const addEmbeddingToIndex = (embedding: number[], indexId: number) => {
	annoyIndex.addItem(indexId, embedding)
	nextIndexId++
}

// Function to build the Annoy index
const buildIndex = () => {
	annoyIndex.build(20) // Build the index with 10 trees (adjust based on your needs)
}

// Function to search for nearest neighbors in the Annoy index
const searchIndex = (
	embedding: number[],
	numNeighbors: number,
	maxCosineDistance: number,
) => {
	const nearestNeighbors = annoyIndex.getNNsByVector(
		embedding,
		numNeighbors,
		-1,
		true,
	) // -1 means no limit, true returns distances
	return nearestNeighbors
}
