import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, toggleWishlist, setSearchQuery, markRented } from "../store/booksSlice";
import type { RootState, AppDispatch } from "../store";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, searchQuery } = useSelector((s: RootState) => s.books);
  const { user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const filtered = items.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Book Catalog</h1>
      <input
        type="text"
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="border p-2 mb-4 w-full rounded"
      />

      {loading && <p>Loading...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((book) => (
          <div key={book.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="font-bold text-lg">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.body.slice(0, 80)}...</p>

            <p className="mt-2">
              Status:{" "}
              <span
                className={`font-semibold ${
                  book.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {book.available ? "Available" : "Rented"}
              </span>
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => dispatch(toggleWishlist(book.id))}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                {book.wishlist ? "💔 Remove" : "❤️ Wishlist"}
              </button>
              {book.available ? (
                <button
                  onClick={() => dispatch(markRented({ bookId: book.id, userId: user!.id }))}
                  className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Rent
                </button>
              ) : (
                <button disabled className="px-2 py-1 bg-gray-400 text-white rounded">
                  Rented
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
