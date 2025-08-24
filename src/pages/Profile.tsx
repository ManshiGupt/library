import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { clearPenalty } from "../store/penaltySlice";

export default function Profile() {
  const { user } = useSelector((s: RootState) => s.auth);
  const penalties = useSelector((s: RootState) => s.penalty.userPenalties[user?.id || 0] || 0);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">👤 Profile</h1>
      <p>Name: {user?.firstName} {user?.lastName}</p>
      <p>Penalties: ₹{penalties}</p>
      {penalties > 0 && (
        <button
          onClick={() => dispatch(clearPenalty(user!.id))}
          className="mt-3 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Pay Penalty
        </button>
      )}
    </div>
  );
}
