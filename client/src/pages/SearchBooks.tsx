import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks, parseGoogleBooks } from '../utils/API';
import { Book } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      const response = await searchGoogleBooks(searchInput);
      if (!response || !response.items) {
        throw new Error('No books found!');
      }

      const bookData = parseGoogleBooks(response.items);
      setSearchResults(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (book: Book) => {
    try {
      await saveBook({
        variables: { ...book },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for a book"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {searchResults.map((book) => (
          <div key={book.bookId}>
            <h3>{book.title}</h3>
            <p>{book.authors?.join(', ')}</p>
            <p>{book.description}</p>
            <button onClick={() => handleSaveBook(book)}>Save Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
