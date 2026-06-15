// store/slices/userSlice.ts

import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type { User } from "@supabase/supabase-js";

import { getCurrentUser } from "../../AuthContext/getUserData";

export const fetchUser =
  createAsyncThunk(
    "user/fetchUser",

    async () => {
      return await getCurrentUser();
    }
  );


// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )

      .addCase(
        fetchUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message ??
            "Unknown error";
        }
      );
  },
});

export const { clearUser } =userSlice.actions;

export default userSlice.reducer;


  