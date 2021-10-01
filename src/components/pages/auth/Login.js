import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { login } from "../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showError, setShowError] = useState(null);

	const { isAuthenticated, loading, error } = useSelector(
		(state) => state.auth
	);

	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login({ email, password }));
	};

	useEffect(() => {
		if (error?.id === "LOGIN_FAIL") setShowError(error.msg);
	}, [error]);

	if (isAuthenticated) {
		return <Redirect to="/" />;
	}

	return (
		<div className="auth">
			<div className="content">
				<div className="heading">
					<h2>Login</h2>
					<p>
						Please fill the form with your information to login.
						<br />
						<Link to="/register">
							If you don't have an account, go to register!
						</Link>
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<input
						name="email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						name="password"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit">{!loading ? "Login" : "Loading..."}</button>
					{showError && <div className="error">{showError}</div>}
				</form>
			</div>
		</div>
	);
}
