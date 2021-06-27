import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

function Login(props) {
	// render form to login, post credentials to API
	const [user, setUser] = useState({});
	const [redirectLink, setRedirectLink] = useState(null);
	const [wrongUserPwMessage, setMessage] = useState(null);

	const handleChange = (e) => {
		let userInfo = { ...user, [e.target.name]: e.target.value };
		setUser(userInfo);
	};

	useEffect(() => {
		setRedirectLink(null);
	}, []);

	useEffect(() => {
		setUser({});
	}, []);

	useEffect(() => {
		setMessage(null);
	}, []);

	const submitUserInfo = async (e) => {
		e.preventDefault();
		const loginURL = "http://localhost:5000/login";
		// POST user info to database, get JWT and pass to maing App component
		const loginRequest = await fetch(loginURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		}).catch((err) => {
			console.log(err);
		});
		if (loginRequest.ok) {
			const loginResponse = await loginRequest.json();
			// pass jwt token to main app page for distribution
			const token = await loginResponse.token;
			const userID = await loginResponse.user._id;
			props.handleLogin({ token, userID });
			// redirect to index on successful login
			setRedirectLink("/");
		} else {
			console.log("error occured");
			setMessage("Invalid username or password");
		}
	};

	if (redirectLink) {
		return <Redirect to={`${redirectLink}`} />;
	} else {
		return (
			<div className="main-container">
				<form className="form-padding">
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							className="form-control user-inp"
							type="text"
							name="username"
							placeholder="Enter Username"
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							className="form-control user-inp"
							type="password"
							name="password"
							placeholder="Enter Password"
							onChange={handleChange}
							required
						/>
					</div>
					{wrongUserPwMessage ? (
						<small className="form-text text-muted error-msg">
							{wrongUserPwMessage}
						</small>
					) : null}
					<button className="btn btn-primary" onClick={submitUserInfo}>
						Login
					</button>
				</form>
			</div>
		);
	}
}

export default Login;
