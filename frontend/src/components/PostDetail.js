import { useState, useEffect } from "react";
import PostCard from "./PostCard";

function PostDetail(props) {
	const [post, setPost] = useState(null);
	const [commentForm, setCommentForm] = useState(false);
	const [comment, setComment] = useState(null);

	let apiURL = `http://localhost:5000/post/post-detail/${props.match.params.postID}`;
	const getPost = async () => {
		// fetch post details from DB and set as state
		const postResponse = await fetch(apiURL, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
		});
		if (postResponse.ok) {
			const postData = await postResponse.json();
			setPost(postData.post);
		} else {
			console.log("Error fetching post data");
		}
		return;
	};

	const toggleCommentForm = (e) => {
		e.preventDefault();
		setCommentForm(!commentForm);
	};

	const handleChange = (e) => {
		let comment = e.target.value;
		setComment(comment);
	};

	const submitComment = (e) => {
		e.preventDefault();
		let apiURL = `http://localhost:5000/post/comments/${props.match.params.postID}`;
		const commentData = {
			user: props.userID,
			comment: comment,
		};
		const postComment = fetch(apiURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify(commentData),
		});
	};

	// set post data to state on component mount
	useEffect(() => {
		getPost();
	}, []);

	// for debugging to see post state
	useEffect(() => {
		console.log(post);
	}, [post]);

	return (
		<div>
			{post ? (
				<PostCard
					post={post}
					editable={false}
					commentable={true}
					commentPost={toggleCommentForm}
				/>
			) : (
				<h1>Loading...</h1>
			)}
			{commentForm ? (
				<form>
					<textarea
						className="form-control form-content"
						id="commentContent"
						name="comment"
						onChange={handleChange}
						placeholder="Comment"
						value={comment}
						required
					/>
					<button
						className="btn btn-primary post-control-btn"
						onClick={submitComment}
					>
						Submit
					</button>
					<button
						className="btn btn-primary post-control-btn"
						onClick={toggleCommentForm}
					>
						Cancel
					</button>
				</form>
			) : null}
		</div>
	);
}

export default PostDetail;
