import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PostList from "./components/PostList";
import Login from "./components/Login";
import PostForm from "./components/PostForm";
import NavBar from "./components/NavBar";
import AuthedApp from "./components/AuthedApp";
import { useState, useEffect } from "react";

function App() {
	const [userToken, setToken] = useState("");
	const [loggedIn, setLogin] = useState(false);
	const [toggleLogin, setToggleLogin] = useState(false);
	const [postForm, setPostForm] = useState(false);
	const [updateForm, setUpdateForm] = useState(false);
	const [deleteForm, setDeleteForm] = useState(false);
	const [toggleProfile, setProfilePage] = useState(false);
	const [togglePostList, setPostList] = useState(false);
	const handleLogin = (token) => {
		// save jwt to state to be distributed to other components
		setToken(token);
		setLogin(true);
		setToggleLogin(false);
	};
	const handleLogout = () => {
		setToken("");
		setLogin(false);
	};
	const toggleLoginForm = () => {
		setToggleLogin(true);
	};
	const togglePostForm = () => {
		// function to toggle post form when creating new post
		setPostForm(true);
	};
	const toggleProfileView = () => {
		// Get user profile, render profile component to the screen
		setProfilePage(true);
	};
	return (
		<div className="App">
			{/* {toggleLogin ? (
				<Login handleLogin={handleLogin} />
			) : (
				<div className="mainBody">
					<nav className="navBar">
						<h1>Logo</h1>
						<ul>
							{loggedIn ? (
								<div className="authed-nav">
									<li onClick={fetchProfile}>Profile</li>
									<li onClick={togglePostForm}>New Post</li>
									<li onClick={handleLogout}>Logout</li>
								</div>
							) : (
								<div className="preauth-nav">
									<li onClick={toggleLoginForm}>Login</li>
								</div>
							)}
						</ul>
					</nav>
					<PostList />
				</div>
			)} */}
			<NavBar
				loginStatus={loggedIn}
				showPostList={togglePostList}
				showLoginForm={toggleLoginForm}
				showProfileForm={toggleProfileView}
				showPostForm={togglePostForm}
				submitLogout={handleLogout}
			/>
			{/* Check login status, if logged in then show authenticated view, if not just post list */}
			<AppBody />
			{loggedIn ? (
				<AuthedApp
					token={userToken}
					createPost={postForm}
					showProfile={toggleProfile}
					deletePost={deleteForm}
					updatePost={updateForm}
				/>
			) : (
				<PostList />
			)}
		</div>
	);
}

export default App;
