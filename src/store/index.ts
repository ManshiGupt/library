import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";
import rentalsReducer from "./rentalsSlice";
import penaltyReducer from "./penaltySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    rentals: rentalsReducer,
     penalty: penaltyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
