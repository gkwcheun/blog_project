import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
require("dotenv").config();

function PostList() {
	// get post from DB and render to component
	const [postList, setPostList] = useState([]);
	useEffect(() => {
		let apiURL = "http://localhost:5000/blog";
		fetch(apiURL)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
			})
			.then((jsonData) => setPostList([...jsonData.posts]))
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<div className="main-container">
			<div className="post-list">
				{postList.map((post) => {
					return (
						<div className="post-card" key={post._id}>
							<h1>
								<Link to={`/post-detail/${post._id}`}>{post.title}</Link>
							</h1>
							<p>{post.content}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default PostList;
