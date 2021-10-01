import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/widgets/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/slices/authSlice";
import { useEffect } from "react";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Notfound from "./components/pages/Notfound/Notfound";
import Home from "./components/pages/Home/Home";
import { useState } from "react";

function App() {
	const dispatch = useDispatch();

	const [testNetwork, setTestNetwork] = useState(true);

	useEffect(() => {
		dispatch(loadUser());
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		window.navigator.onLine ? setTestNetwork(true) : setTestNetwork(false);
		// eslint-disable-next-line
	}, [window.navigator.onLine]);

	return (
		<div className="App">
			{!testNetwork && (
				<div className="online">Internet connection lost, try to reconnect</div>
			)}
			<Router>
				<Navbar />
				<Switch>
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<ProtectedRoute exact path="/" component={Home} />
					<Route path="*" component={Notfound} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
