import { useState, useEffect } from "react";
import PostCard from "./PostCard";

function PostList() {
	// get post from DB and render to component
	const [postList, setPostList] = useState([]);

	useEffect(() => {
		let apiURL = "http://localhost:5000";
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

	const formatPostDate = (dateStr) => {
		return dateStr;
	};

	// useEffect hook to see postList state, for debugging purposes
	// useEffect(() => {
	// 	console.log(postList);
	// }, [postList]);

	return (
		<div className="main-container">
			<div className="post-list">
				{postList.map((post) => {
					return <PostCard post={post} editable={false} />;
				})}
			</div>
		</div>
	);
}

export default PostList;
