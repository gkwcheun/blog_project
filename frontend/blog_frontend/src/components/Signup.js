import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

function Signup() {
	// render form to login, post credentials to API
	const [user, setUser] = useState({});
	const [redirect, setRedirect] = useState(null);

	const handleChange = (e) => {
		let userInfo = { ...user, [e.target.name]: e.target.value };
		setUser(userInfo);
	};

	// reset redirect so sign up form can be clicked again after redirecting
	useEffect(() => {
		setRedirect(null);
	}, []);

	useEffect(() => {
		setUser(null);
	}, []);

	const submitUserInfo = async (e) => {
		e.preventDefault();
		const signupURL = "http://localhost:5000/signup";
		// POST user info to database, get JWT and pass to maing App component
		const signupRequest = await fetch(signupURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
		if (signupRequest.ok) {
			// redirect to index page if signup successful
			setRedirect(true);
		} else {
			console.log("Something went wrong...Please try again");
		}
	};

	if (redirect) {
		return <Redirect to="/" />;
	} else {
		return (
			<div className="main-container">
				<form>
					<label for="username" />
					<input
						type="text"
						name="username"
						placeholder="username"
						onChange={handleChange}
						required
					/>
					<label for="password" />
					<input
						type="password"
						name="password"
						placeholder="password"
						onChange={handleChange}
						required
					/>
					<button onClick={submitUserInfo}>Sign Up!</button>
				</form>
			</div>
		);
	}
}

export default Signup;
