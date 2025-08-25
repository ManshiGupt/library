import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { returnBook } from "../store/rentalsSlice";
import { fetchBooks, markReturned } from "../store/booksSlice";
import { useEffect, useState } from "react";
import { usePenalty, formatCurrency, formatTimeRemaining, formatGracePeriod } from "../utility/usePenalty";

export default function MyRentals() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: rentals } = useSelector((s: RootState) => s.rentals);
  const { items: books } = useSelector((s: RootState) => s.books);
  const { user } = useSelector((s: RootState) => s.auth);
  const [, setTick] = useState(0);

  const {
    calculatePenaltyInfo,
    getCurrentUserPenalty,
    payCurrentUserPenalty,
    addUserPenalty,
    updatePenaltiesForRentals,
  } = usePenalty();

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const myRentals = rentals.filter((r) => r.userId === user!.id && !r.returned);
  
  useEffect(() => {
    if (books.length === 0) dispatch(fetchBooks());
  }, [books.length, dispatch]);

  // Update penalties in real-time
  useEffect(() => {
    if (!user || myRentals.length === 0) return;
    
    const rentalData = myRentals.map(r => ({ 
      dueTime: r.dueTime, 
      userId: user.id 
    }));
    
    updatePenaltiesForRentals(rentalData);
  }, [myRentals, user, updatePenaltiesForRentals]);

  const totalUserPenalty = getCurrentUserPenalty();

  const handleReturnBook = (bookId: number, dueTime: number) => {
    if (!user) return;
    
    const penaltyInfo = calculatePenaltyInfo(dueTime);
    if (penaltyInfo.amount > 0) {
      addUserPenalty(user.id, penaltyInfo.amount);
    }
    
    dispatch(returnBook(bookId));
    dispatch(markReturned(bookId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📦 My Rentals</h1>
        
        {/* Total Penalty Display */}
        {totalUserPenalty > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-red-800 font-bold text-lg">
                  Total Penalty: {formatCurrency(totalUserPenalty)}
                </p>
                <p className="text-red-600 text-sm">
                  Outstanding amount to be paid
                </p>
              </div>
              <button
                onClick={payCurrentUserPenalty}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>

      {myRentals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">No active rentals</p>
          <p className="text-gray-400 text-sm">Your rented books will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myRentals.map((rental) => {
            const book = books.find((b) => b.id === rental.bookId)!;
            const penaltyInfo = calculatePenaltyInfo(rental.dueTime);
            const timeRemaining = formatTimeRemaining(rental.dueTime);
            
            return (
              <div 
                key={rental.bookId} 
                className={`border rounded-xl p-6 transition-all duration-200 ${
                  penaltyInfo.isOverdue 
                    ? 'border-red-300 bg-red-50 shadow-red-100' 
                    : 'border-gray-200 bg-white hover:shadow-md'
                } shadow-sm`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-bold text-xl text-gray-800 mb-3">{book.title}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Started:</span>
                        <p className="font-medium text-gray-700">
                          {new Date(rental.startTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Due:</span>
                        <p className="font-medium text-gray-700">
                          {new Date(rental.dueTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          penaltyInfo.isOverdue 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {timeRemaining}
                        </span>
                      </div>
                      
                      {penaltyInfo.isOverdue && (
                        <div className="space-y-1">
                          {penaltyInfo.amount > 0 ? (
                            <p className="text-red-700 font-bold">
                              Current Penalty: {formatCurrency(penaltyInfo.amount)}
                            </p>
                          ) : (
                            <p className="text-orange-600 font-medium">
                              {formatGracePeriod(penaltyInfo.gracePeriodRemaining)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      onClick={() => handleReturnBook(rental.bookId, rental.dueTime)}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Return Book
                    </button>
                    {penaltyInfo.amount > 0 && (
                      <div className="text-xs text-red-600 text-center">
                        +{formatCurrency(penaltyInfo.amount)} penalty
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Penalty Information Panel */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          Penalty Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span className="text-blue-700">24-hour grace period after due time</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">⚠️</span>
            <span className="text-blue-700">₹5 penalty per hour after grace period</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">💳</span>
            <span className="text-blue-700">
              {totalUserPenalty > 0 
                ? `Current total: ${formatCurrency(totalUserPenalty)}`
                : 'No pending penalties'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}