import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleRemoveBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const savedBooks = data?.me.savedBooks || [];

  return (
    <div>
      <h2>Saved Books</h2>
      {savedBooks.length ? (
        <div>
          {savedBooks.map((book: any) => (
            <div key={book.bookId}>
              <h3>{book.title}</h3>
              <p>{book.authors.join(', ')}</p>
              <p>{book.description}</p>
              <button onClick={() => handleRemoveBook(book.bookId)}>
                Remove Book
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no saved books.</p>
      )}
    </div>
  );
};

export default SavedBooks;
