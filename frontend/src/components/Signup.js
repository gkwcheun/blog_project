import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

function Signup() {
	// render form to login, post credentials to API
	const [user, setUser] = useState({});
	const [profilePicture, setProfilePicture] = useState(null);
	const [redirect, setRedirect] = useState(null);

	const handleChange = (e) => {
		if (e.target.name === "dp") {
			setProfilePicture(e.target.files[0]);
		} else {
			let userInfo = { ...user, [e.target.name]: e.target.value };
			setUser(userInfo);
		}
	};

	// reset redirect so sign up form can be clicked again after redirecting
	useEffect(() => {
		setRedirect(null);
	}, []);

	useEffect(() => {
		setUser(null);
	}, []);

	useEffect(() => {
		console.log(profilePicture);
	}, [profilePicture]);

	const submitUserInfo = async (e) => {
		e.preventDefault();
		const signupURL = "http://localhost:5000/signup";
		// POST user info to database, get JWT and pass to maing App component
		const formData = new FormData();
		formData.append("dp", profilePicture);
		formData.append("username", user.username);
		formData.append("password", user.password);
		console.log(formData);
		const signupRequest = await fetch(signupURL, {
			method: "POST",
			body: formData,
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
				<form encType="multipart/form-data" className="form-padding">
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							name="username"
							className="form-control user-inp"
							placeholder="Enter Username"
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							className="form-control user-inp"
							placeholder="Enter Password"
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="dp">Profile Picture</label>
						<input
							type="file"
							name="dp"
							className="form-control-file"
							accept=".png .jpg .jpeg"
							onChange={handleChange}
						></input>
					</div>
					<button className="btn btn-primary" onClick={submitUserInfo}>
						Sign Up!
					</button>
				</form>
			</div>
		);
	}
}

export default Signup;
