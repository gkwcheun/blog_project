import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PostList from "./components/PostList";
import Login from "./components/Login";
import PostForm from "./components/PostForm";
import NavBar from "./components/NavBar";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import PostDetail from "./components/PostDetail";
import { useEffect, useState } from "react";
require("dotenv").config();

function App() {
	const [userToken, setToken] = useState(null);
	const [userID, setUserID] = useState(null);
	const [loggedIn, setLogin] = useState(false);

	const handleLogin = (userInfo) => {
		// save jwt to state to be distributed to other components
		console.log("handle login called");
		setToken(userInfo.token);
		setUserID(userInfo.userID);
		setLogin(true);
	};
	const handleLogout = () => {
		console.log("handle logout");
		setToken(null);
		setLogin(false);
	};

	useEffect(() => {
		console.log(userToken);
	}, [userToken]);

	useEffect(() => {
		console.log(userID);
	}, [userID]);

	return (
		<div className="app-body">
			<Router>
				<NavBar
					loggedIn={loggedIn}
					userID={userID}
					handleLogout={handleLogout}
				/>
				<Switch>
					<Route
						path="/profile/:userID"
						exact
						render={(props) => <Profile {...props} token={userToken} />}
					/>
					<Route
						path="/create"
						exact
						render={(props) => (
							<PostForm
								{...props}
								token={userToken}
								editPost={false}
								userID={userID}
							/>
						)}
					/>
					<Route
						path="/login"
						exact
						render={(props) => <Login {...props} handleLogin={handleLogin} />}
					/>
					<Route
						path="/post-detail/:postID"
						exact
						render={(props) => (
							<PostDetail
								{...props}
								token={userToken}
								userID={userID}
								isLoggedIn={loggedIn}
							/>
						)}
					/>
					<Route
						path="/edit/:postID"
						exact
						render={(props) => (
							<PostForm
								{...props}
								token={userToken}
								editPost={true}
								userID={userID}
							/>
						)}
					/>
					<Route path="/signup" exact component={Signup} />
					<Route path="/" exact component={PostList} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
