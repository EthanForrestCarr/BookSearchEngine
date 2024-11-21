// Utility functions for interacting with the Google Books API
import { Book } from './localStorage'; // Assuming Book is defined in localStorage.ts

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Define types for API responses
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail: string };
    infoLink: string;
  };
}

export interface GoogleBooksResponse {
  items: GoogleBook[];
  totalItems: number;
}

// Search for books using the Google Books API
export const searchGoogleBooks = async (query: string): Promise<GoogleBooksResponse | null> => {
  if (!query) {
    console.error('Search query is required.');
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data: GoogleBooksResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books from Google API:', error);
    return null;
  }
};

// Extract book data for easier consumption in components
export const parseGoogleBooks = (books: GoogleBook[]): Book[] => {
  return books.map((book) => ({
    bookId: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors || ['No author listed'],
    description: book.volumeInfo.description || 'No description available',
    image: book.volumeInfo.imageLinks?.thumbnail || '',
    link: book.volumeInfo.infoLink,
  }));
};
