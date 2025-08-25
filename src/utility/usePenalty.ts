import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "../store";
import { addPenalty, clearPenalty } from "../store/penaltySlice";

export interface PenaltyInfo {
  amount: number;
  isOverdue: boolean;
  gracePeriodRemaining: number;
  hoursOverdue: number;
}

export function usePenalty() {
  const dispatch = useDispatch<AppDispatch>();
  const { userPenalties } = useSelector((s: RootState) => s.penalty);
  const { user } = useSelector((s: RootState) => s.auth);

  const calculatePenaltyInfo = useCallback((dueTime: number): PenaltyInfo => {
    const now = Date.now();
    const overdueDuration = now - dueTime;
    const isOverdue = overdueDuration > 0;
    const hoursOverdue = Math.floor(overdueDuration / (1000 * 60 * 60));
    
    // 24-hour grace period
    const gracePeriodHours = 24;
    const gracePeriodRemaining = Math.max(0, gracePeriodHours - hoursOverdue);
    
    // Penalty only applies after grace period
    const penaltyHours = Math.max(0, hoursOverdue - gracePeriodHours);
    const amount = penaltyHours * 5; // ₹5 per hour

    return {
      amount,
      isOverdue,
      gracePeriodRemaining,
      hoursOverdue,
    };
  }, []);

  const addUserPenalty = useCallback((userId: number, amount: number) => {
    if (amount > 0) {
      dispatch(addPenalty({ userId, amount }));
    }
  }, [dispatch]);

  const clearUserPenalty = useCallback((userId: number) => {
    dispatch(clearPenalty(userId));
  }, [dispatch]);

  const getUserPenalty = useCallback((userId: number): number => {
    return userPenalties[userId] || 0;
  }, [userPenalties]);

  const getCurrentUserPenalty = useCallback((): number => {
    return user ? getUserPenalty(user.id) : 0;
  }, [user, getUserPenalty]);

  const payCurrentUserPenalty = useCallback(() => {
    if (user) {
      clearUserPenalty(user.id);
    }
  }, [user, clearUserPenalty]);

  // Auto-update penalties for a list of rentals
  const updatePenaltiesForRentals = useCallback((rentals: Array<{ dueTime: number; userId: number }>) => {
    rentals.forEach(({ dueTime, userId }) => {
      const penaltyInfo = calculatePenaltyInfo(dueTime);
      const currentStoredPenalty = getUserPenalty(userId);
      
      if (penaltyInfo.amount > currentStoredPenalty) {
        addUserPenalty(userId, penaltyInfo.amount - currentStoredPenalty);
      }
    });
  }, [calculatePenaltyInfo, getUserPenalty, addUserPenalty]);

  return {
    calculatePenaltyInfo,
    addUserPenalty,
    clearUserPenalty,
    getUserPenalty,
    getCurrentUserPenalty,
    payCurrentUserPenalty,
    updatePenaltiesForRentals,
    userPenalties,
  };
}

// Format currency helper
export function formatCurrency(amount: number): string {
  return `₹${amount}`;
}

// Time formatting helpers
export function formatTimeRemaining(dueTime: number): string {
  const diff = dueTime - Date.now();
  if (diff <= 0) return "Overdue";
  
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  
  return `${hrs}h ${mins}m ${secs}s`;
}

export function formatGracePeriod(gracePeriodRemaining: number): string {
  if (gracePeriodRemaining <= 0) return "Grace period expired";
  return `${gracePeriodRemaining}h grace period remaining`;
}