import { useState, useEffect } from "react";
import PostCard from "./PostCard";

function PostDetail(props) {
	const [post, setPost] = useState(null);
	const [commentForm, setCommentForm] = useState(false);
	const [comment, setComment] = useState(null);

	let apiURL = `http://localhost:5000/post/${props.match.params.postID}`;

	const getPost = async () => {
		// fetch post details from DB and set as state
		const postResponse = await fetch(apiURL, {
			method: "GET",
			// headers: {
			// 	Authorization: `Bearer ${props.token}`,
			// },
		});
		if (postResponse.ok) {
			const postData = await postResponse.json();
			setPost(postData.post);
		} else {
			console.log("Error fetching post data");
		}
		return;
	};

	const toggleCommentForm = (e = null) => {
		if (e) {
			e.preventDefault();
		}
		setCommentForm(!commentForm);
	};

	const handleChange = (e) => {
		let comment = e.target.value;
		setComment(comment);
	};

	const submitComment = async (e) => {
		e.preventDefault();
		let apiURL = `http://localhost:5000/comments/${props.match.params.postID}`;
		const commentData = {
			user: props.userID,
			comment: comment,
		};
		const postComment = await fetch(apiURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify(commentData),
		});
		if (postComment.ok) {
			console.log("Successfully added comment to database.");
		} else {
			console.log("Error adding comment to database");
		}
		await getPost();
		toggleCommentForm();
	};

	const deleteComment = async (postID, commentID) => {
		let commentDeleteURL = `http://localhost:5000/post/${postID}/comments/${commentID}`;
		const deleteResponse = await fetch(commentDeleteURL, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
		});
		if (deleteResponse.ok) {
			console.log("successfully deleted");
			// call function to modify post detail state
			await getPost();
		} else {
			console.log("Something went wrong with deletion process");
		}
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
					commentable={props.isLoggedIn}
					commentPost={toggleCommentForm}
					deleteComment={deleteComment}
					commentsViewable={true}
					currentUserID={props.userID}
					token={props.token}
				/>
			) : (
				<h1>Loading...</h1>
			)}
			{commentForm ? (
				<form className="comment-form">
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
