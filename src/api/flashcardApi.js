// src/api/flashcardApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/flashcard-sets'; // Adjust this if needed

// Fetch all flashcards in a flashcard set
export const getAllFlashcards = async (setId) => {
    const response = await axios.get(`${API_BASE_URL}/${setId}/flashcards`);
    return response.data;
};

// Fetch a specific flashcard by ID
export const getFlashcardById = async (setId, id) => {
    const response = await axios.get(`${API_BASE_URL}/${setId}/flashcards/${id}`);
    return response.data;
};

// Create a new flashcard
export const createFlashcard = async (setId, flashcard) => {
    const response = await axios.post(`${API_BASE_URL}/${setId}/flashcards`, flashcard);
    return response.data;
};

// Update a flashcard
export const updateFlashcard = async (setId, id, flashcard) => {
    const response = await axios.put(`${API_BASE_URL}/${setId}/flashcards/${id}`, flashcard);
    return response.data;
};

// Delete a flashcard
export const deleteFlashcard = async (setId, id) => {
    await axios.delete(`${API_BASE_URL}/${setId}/flashcards/${id}`);
};