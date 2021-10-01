import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import messengerReducer from "./slices/messengerSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		messenger: messengerReducer,
	},
});

export default store;
