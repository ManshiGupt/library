import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image: string;

}

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
//      stats: {
//     totalRented: number;
//     activeRentals: number;
//   };
// }

// const initialState: AuthState = {
//   user: JSON.parse(localStorage.getItem("user") || "null"),
//   isAuthenticated: !!localStorage.getItem("user"),
//   loading: false,
//   error: null,
//     stats: { totalRented: 0, activeRentals: 0 },
// };
// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
//   stats: {
//     totalRented: number;
//     activeRentals: number;
//   };
//   penalties: number;
// }

// const initialState: AuthState = {
//   user: JSON.parse(localStorage.getItem("user") || "null"),
//   isAuthenticated: !!localStorage.getItem("user"),
//   loading: false,
//   error: null,
//   stats: { totalRented: 0, activeRentals: 0 },
//   penalties: 0,
// };
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  stats: {
    totalRented: number;
    activeRentals: number;
  };
  penalties: number;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  loading: false,
  error: null,
  stats: { totalRented: 0, activeRentals: 0 },
  penalties: 0,
};


// Async thunk to simulate login with DummyJSON API
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }: { username: string; password: string }) => {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log("manshi",res)

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    return (await res.json()) as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },updateStats: (state, action: PayloadAction<{ totalRented: number; activeRentals: number }>) => {
  state.stats = action.payload;
},
updatePenalties: (state, action: PayloadAction<number>) => {
  state.penalties = action.payload;
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout , updateStats, updatePenalties} = authSlice.actions;
export default authSlice.reducer;
