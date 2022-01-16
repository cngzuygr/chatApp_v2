import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	verificationCodeRed: null,
};

export const navSlice = createSlice({
	name: "nav",
	initialState,
	reducers: {
		setVerificationCodeRed: (state, action) => {
			state.verificationCodeRed = action.payload;
		},
	},
});

export const { setVerificationCodeRed } = navSlice.actions;

//Selectors
export const selectVerificationCodeRed = (state) =>
	state.nav.verificationCodeRed;

export default navSlice.reducer;
