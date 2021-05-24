import { Link } from "react-router-dom";

function NavBar(props) {
	// receive login status as props and store in component state
	// NavBar renders differnt nav depending on log in status
	return (
		<nav className="nav-bar">
			<h1 className="logo">
				<Link className="logo-link" to="/">
					GalvinBlog
				</Link>
			</h1>
			{props.loggedIn ? (
				<div className="nav-link-container">
					<Link className="nav-link" to={`/profile/${props.userID}`}>
						Profile
					</Link>
					<Link className="nav-link" to="/create">
						New Post
					</Link>
					<Link className="nav-link" to="/" onClick={props.handleLogout}>
						Logout
					</Link>
				</div>
			) : (
				<div className="nav-link-container">
					<Link className="nav-link" to="/login">
						Login
					</Link>
					<Link className="nav-link" to="/signup">
						Sign Up
					</Link>
				</div>
			)}
		</nav>
	);
}

export default NavBar;
