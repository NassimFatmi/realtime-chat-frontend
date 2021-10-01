import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiURL } from "../../config/default.json";

const initialState = {
	token: localStorage.getItem("auth-token"),
	user: null,
	isAuthenticated: false,
	loading: true,
	error: {
		msg: "",
		status: null,
		id: null,
	},
};

export const loadUser = createAsyncThunk(
	"auth/loadUser",
	async (_, { getState, rejectWithValue }) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const token = getState().auth.token;
		if (token) config.headers["x-auth-token"] = token;

		try {
			const response = await axios.get(apiURL + "/auth", config);
			return response.data;
		} catch (err) {
			return rejectWithValue({
				msg: err.response.data.errors[0].msg,
				status: err.response.status,
			});
		}
	}
);

export const register = createAsyncThunk(
	"auth/register",
	async ({ name, email, password }, { dispatch, rejectWithValue }) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const userData = {
			name,
			email,
			password,
		};
		try {
			const response = await axios.post(apiURL + "/users", userData, config);
			return response.data;
		} catch (err) {
			return rejectWithValue({
				msg: err.response.data.errors[0].msg,
				status: err.response.status,
				id: "REGISTER_FAIL",
			});
		}
	}
);

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password }, { dispatch, rejectWithValue }) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const userData = {
			email,
			password,
		};
		try {
			const response = await axios.post(apiURL + "/auth", userData, config);
			return response.data;
		} catch (err) {
			return rejectWithValue({
				msg: err.response.data.errors[0].msg,
				status: err.response.status,
				id: "LOGIN_FAIL",
			});
		}
	}
);

export const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		logout: (state) => {
			localStorage.removeItem("auth-token");
			state.loading = false;
			state.isAuthenticated = false;
			state.token = null;
			state.user = null;
		},
	},
	extraReducers: {
		// LoadUser
		[loadUser.pending]: setLoading,
		[loadUser.fulfilled]: (state, action) => {
			state.loading = false;
			state.isAuthenticated = true;
			state.user = action.payload;
			state.error = {
				msg: "",
				status: null,
				id: null,
			};
		},
		[loadUser.rejected]: setReject,

		// Register user
		[register.pending]: setLoading,
		[register.fulfilled]: authSuccessful,
		[register.rejected]: setReject,

		// login
		[login.pending]: setLoading,
		[login.fulfilled]: authSuccessful,
		[login.rejected]: setReject,
	},
});

function setLoading(state) {
	state.loading = true;
}

function setReject(state, action) {
	localStorage.removeItem("auth-token");
	state.loading = false;
	state.isAuthenticated = false;
	state.token = null;
	state.user = null;
	state.error = action.payload;
}

function authSuccessful(state, action) {
	const { token, user } = action.payload;
	localStorage.setItem("auth-token", token);
	state.token = token;
	state.loading = false;
	state.isAuthenticated = true;
	state.user = user;
	state.error = {
		msg: "",
		status: null,
		id: null,
	};
}

export const { logout } = authSlice.actions;
export default authSlice.reducer;
