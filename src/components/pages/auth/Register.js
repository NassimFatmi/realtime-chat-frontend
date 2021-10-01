import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { register } from "../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showError, setShowError] = useState(null);

	const { isAuthenticated, loading, error } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (error?.id === "REGISTER_FAIL") setShowError(error.msg);
	}, [error]);

	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(register({ name, email, password }));
	};

	if (isAuthenticated) {
		return <Redirect to="/" />;
	}

	return (
		<div className="auth">
			<div className="content">
				<div className="heading">
					<h2>Register</h2>
					<p>
						Please fill the form with your information to create a new account.
						<br />
						<Link to="/login">
							If you already have an account, go to login!
						</Link>
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<input
						name="name"
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
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
					<button type="submit" className={loading ? "disabled" : ""}>
						{!loading ? "Register" : "Loading"}
					</button>
					{showError && <div className="error">{showError}</div>}
				</form>
			</div>
		</div>
	);
}
