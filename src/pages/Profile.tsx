import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { clearPenalty } from "../store/penaltySlice";
import { formatCurrency, usePenalty } from "../utility/usePenalty";

export default function Profile() {
  const { user } = useSelector((s: RootState) => s.auth);
  const penalties = useSelector((s: RootState) => s.penalty.userPenalties[user?.id || 0] || 0);
  const dispatch = useDispatch<AppDispatch>();
  const { items: rentals } = useSelector((s: RootState) => s.rentals);
 
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //  const rentals = useSelector((state: RootState) => state.rentals.items);
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const books = useSelector((state: RootState) => state.books.items);

const {
   
    getCurrentUserPenalty,
    payCurrentUserPenalty,
   
  } = usePenalty();
    const totalUserPenalty = getCurrentUserPenalty();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">👤 Profile</h1>
      <p>Name: {user?.firstName} {user?.lastName}</p>
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
      <p>Penalties: ₹{penalties}</p>
      {penalties > 0 && (
        <button
          onClick={() => dispatch(clearPenalty(user!.id))}
          className="mt-3 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Pay Penalty
        </button>
      )}
      Total Books Rented: {rentals.length }
    </div>
    
  );
}
