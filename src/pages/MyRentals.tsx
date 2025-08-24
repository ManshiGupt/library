import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { returnBook } from "../store/rentalsSlice";
import { fetchBooks, markReturned } from "../store/booksSlice";
import { useEffect, useState } from "react";

function countdown(due: number) {
  const diff = due - Date.now();
  if (diff <= 0) return "Overdue";
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${hrs}h ${mins}m ${secs}s`;
}

export default function MyRentals() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: rentals } = useSelector((s: RootState) => s.rentals);
  const { items: books } = useSelector((s: RootState) => s.books);
  const { user } = useSelector((s: RootState) => s.auth);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const myRentals = rentals.filter((r) => r.userId === user!.id && !r.returned);
  useEffect(() => {
  if (books.length === 0) dispatch(fetchBooks());
}, [books.length, dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 My Rentals</h1>
      {myRentals.length === 0 ? <p>No active rentals</p> : null}
      {myRentals.map((r) => {
        const book = books.find((b) => b.id === r.bookId)!;
        return (
          <div key={r.bookId} className="border p-4 rounded-lg mb-3">
            <h2 className="font-bold">{book.title}</h2>
            <p>Start: {new Date(r.startTime).toLocaleString()}</p>
            <p>Due: {new Date(r.dueTime).toLocaleString()}</p>
            <p className="text-red-600">Time left: {countdown(r.dueTime)}</p>
            <button
              onClick={() => {
                dispatch(returnBook(r.bookId));
                dispatch(markReturned(r.bookId));
              }}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Return Book
            </button>
          </div>
        );
      })}
    </div>
  );
}
