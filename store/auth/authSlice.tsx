import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "none",
    didInfo: {
      isSuccessful: false,
      errorCode: null,
      dataHash: "",
    },
  },
  reducers: {
    // Existing reducer to set the token
    setToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
    },
    // New reducer to set DID info
    setDIDInfo: (state, action) => {
      const { isSuccessful, errorCode, dataHash } = action.payload;
      state.didInfo.isSuccessful = isSuccessful;
      state.didInfo.errorCode = errorCode;
      state.didInfo.dataHash = dataHash;
    },
  },
});

// Export the actions
export const { setToken, setDIDInfo } = authSlice.actions;
// Export the reducer
export default authSlice.reducer;
