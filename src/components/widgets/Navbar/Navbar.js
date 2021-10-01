import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { IconContext } from "react-icons";
import { FaFacebookMessenger } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

export default function Navbar() {
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const links = isAuthenticated ? (
		<>
			<li>
				<Link
					to="/login"
					onClick={() => {
						dispatch(logout());
					}}
				>
					Logout
				</Link>
			</li>
		</>
	) : (
		<>
			<li>
				<Link to="/login">Login</Link>
			</li>
			<li>
				<Link to="/register">Register</Link>
			</li>
		</>
	);
	return (
		<nav className="navbar">
			<div className="container">
				<div className="logo">
					<Link to="/">
						<IconContext.Provider value={{ className: "logo-icon" }}>
							<FaFacebookMessenger />
						</IconContext.Provider>
					</Link>
					<h4>by NassimFatmi</h4>
				</div>
				<ul className="links">
					{user && (
						<li>
							<p>{user.name}</p>
						</li>
					)}
					{links}
				</ul>
			</div>
		</nav>
	);
}
