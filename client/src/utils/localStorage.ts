// Define a type for the Book object
export interface Book {
  bookId: string;
  authors?: string[];
  description?: string;
  title: string;
  image?: string;
  link?: string;
}

// Save books to localStorage
export const saveBooks = (books: Book[]) => {
  if (!books || !Array.isArray(books)) {
    console.error('Invalid books data. Expected an array.');
    return;
  }

  try {
    localStorage.setItem('saved_books', JSON.stringify(books));
  } catch (err) {
    console.error('Error saving books to localStorage:', err);
  }
};

// Retrieve saved books from localStorage
export const getSavedBooks = (): Book[] => {
  try {
    const savedBooks = localStorage.getItem('saved_books');
    return savedBooks ? JSON.parse(savedBooks) : [];
  } catch (err) {
    console.error('Error retrieving books from localStorage:', err);
    return [];
  }
};

// Remove a book from localStorage
export const removeBook = (bookId: string) => {
  if (!bookId) {
    console.error('No bookId provided for removal.');
    return;
  }

  try {
    const savedBooks = getSavedBooks();
    const updatedBooks = savedBooks.filter((book) => book.bookId !== bookId);
    saveBooks(updatedBooks);
  } catch (err) {
    console.error('Error removing book from localStorage:', err);
  }
};
