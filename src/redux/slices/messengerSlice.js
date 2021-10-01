import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiURL } from "../../config/default.json";

const initialState = {
	conversations: [],
	messengerLoading: false,
	messengerErrors: {
		msg: "",
		status: null,
	},
};

export const getConversations = createAsyncThunk(
	"messenger/getConversations",
	async (_, { getState, rejectWithValue }) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				"x-auth-token": getState().auth.token,
			},
		};

		try {
			const response = await axios.get(apiURL + "/conversations", config);
			return response.data;
		} catch (err) {
			return rejectWithValue({
				msg: err.response.data.errors[0].msg,
				status: err.response.status,
			});
		}
	}
);

export const createConversation = createAsyncThunk(
	"messenger/createConversation",
	async (reciverId, { getState, rejectWithValue }) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				"x-auth-token": getState().auth.token,
			},
		};

		try {
			const response = await axios.post(
				apiURL + "/conversations",
				{ reciverId },
				config
			);
			return response.data;
		} catch (err) {
			return rejectWithValue({
				msg: err.response.data.errors[0].msg,
				status: err.response.status,
			});
		}
	}
);

export const messengerSlice = createSlice({
	name: "messenger",
	initialState: initialState,

	extraReducers: {
		[getConversations.pending]: setLoading,

		[getConversations.fulfilled]: (state, action) => {
			state.messengerLoading = false;
			state.conversations = action.payload;
		},
		[getConversations.rejected]: (state, action) => {
			state.messengerLoading = false;
			state.messengerErrors = action.payload;
		},
		[createConversation.pending]: setLoading,

		[createConversation.fulfilled]: (state, action) => {
			state.messengerLoading = false;
			state.conversations = [...state.conversations, action.payload];
		},
		[createConversation.rejected]: (state, action) => {
			state.messengerLoading = false;
			state.messengerErrors = action.payload;
		},
	},
});

function setLoading(state) {
	state.messengerLoading = true;
}
export default messengerSlice.reducer;
