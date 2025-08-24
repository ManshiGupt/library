import { createSlice, createAsyncThunk,  } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface Book {
  id: number;
  title: string;
  body: string; // treat as description
  available: boolean;
  rentedBy?: number; // userId
  wishlist?: boolean;
}

interface BooksState {
  items: Book[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: BooksState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
};

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=20");
  return (await res.json()) as Book[];
});

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<number>) => {
      const book = state.items.find((b) => b.id === action.payload);
      if (book) book.wishlist = !book.wishlist;
    },
    markRented: (state, action: PayloadAction<{ bookId: number; userId: number }>) => {
      const book = state.items.find((b) => b.id === action.payload.bookId);
      if (book) {
        book.available = false;
        book.rentedBy = action.payload.userId;
      }
    },
    markReturned: (state, action: PayloadAction<number>) => {
      const book = state.items.find((b) => b.id === action.payload);
      if (book) {
        book.available = true;
        book.rentedBy = undefined;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((b) => ({
          ...b,
          available: true,
        }));
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load books";
      });
  },
});

export const { toggleWishlist, markRented, markReturned, setSearchQuery } = booksSlice.actions;
export default booksSlice.reducer;
