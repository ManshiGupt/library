import { createSlice,  } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface PenaltyState {
  userPenalties: Record<number, number>; // userId -> amount
}

const initialState: PenaltyState = {
  userPenalties: {},
};

const penaltySlice = createSlice({
  name: "penalty",
  initialState,
  reducers: {
    addPenalty: (state, action: PayloadAction<{ userId: number; amount: number }>) => {
      state.userPenalties[action.payload.userId] =
        (state.userPenalties[action.payload.userId] || 0) + action.payload.amount;
    },
    clearPenalty: (state, action: PayloadAction<number>) => {
      state.userPenalties[action.payload] = 0;
    },
  },
});

export const { addPenalty, clearPenalty } = penaltySlice.actions;
export default penaltySlice.reducer;
