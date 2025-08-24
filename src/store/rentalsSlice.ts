import { createSlice,  } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface Rental {
  bookId: number;
  userId: number;
  startTime: number;
  dueTime: number;
  returned: boolean;
}

interface RentalsState {
  items: Rental[];
}

const initialState: RentalsState = { items: [] };

const rentalsSlice = createSlice({
  name: "rentals",
  initialState,
  reducers: {
    rentBook: (state, action: PayloadAction<{ bookId: number; userId: number }>) => {
      const now = Date.now();
      state.items.push({
        bookId: action.payload.bookId,
        userId: action.payload.userId,
        startTime: now,
        dueTime: now + 24 * 60 * 60 * 1000, // 24 hrs
        returned: false,
      });
    },
    returnBook: (state, action: PayloadAction<number>) => {
      const rental = state.items.find((r) => r.bookId === action.payload && !r.returned);
      if (rental) rental.returned = true;
    },
  },
});

export const { rentBook, returnBook } = rentalsSlice.actions;
export default rentalsSlice.reducer;
