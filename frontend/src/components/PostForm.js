import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

// create and edit post form
// if editing, post form should prepopulate with content of original form
function PostForm(props) {
	const [post, setPost] = useState({ toBePublished: false });
	const [afterEditLink, setAfterEditLink] = useState(null);

	const apiURLS = {
		create: "http://localhost:5000/post/create-post",
		update: `http://localhost:5000/post/update-post/${props.match.params.postID}`,
	};

	const handleChange = (e) => {
		let postData = { ...post, [e.target.name]: e.target.value };
		setPost(postData);
	};

	const afterEditSubmit = (e = null) => {
		console.log("after submit called");
		if (e) {
			e.preventDefault();
		}
		setAfterEditLink(post.user);
	};

	const clearFields = () => {
		// clear form fields on submit
		let postTitle = document.getElementById("postTitle");
		postTitle.value = "";
		let postContent = document.getElementById("postContent");
		postContent.value = "";
	};

	const submitPost = async (e) => {
		// submit post data to database
		e.preventDefault();
		setPost({ ...post, toBePublished: true });
		const postRequest = await fetch(apiURLS.create, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify({ title: post.title, content: post.content }),
		});
		if (postRequest.ok) {
			const postResponse = await postRequest.json();
			console.log(post);
			console.log(postResponse);
		} else {
			console.log("Error adding post to database");
		}
		clearFields();
		setAfterEditLink(props.userID);
	};

	const saveDraft = async (e) => {
		e.preventDefault();
		setPost({ ...post, toBePublished: false });
		// function to save non-published posts to DB
		const postRequest = await fetch(apiURLS.create, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify(post),
		});
		if (postRequest.ok) {
			const postResponse = await postRequest.json();
			console.log(postResponse);
		} else {
			console.log("Error adding post to database");
		}
		clearFields();
		setAfterEditLink(props.userID);
	};

	const getPostDetail = async () => {
		let postDetailURL = `http://localhost:5000/post/post-detail/${props.match.params.postID}`;
		const postDetailResponse = await fetch(postDetailURL, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
		});
		if (postDetailResponse.ok) {
			const postData = await postDetailResponse.json();
			setPost({ ...postData.post });
		}
	};

	const submitPostEdit = async (e) => {
		// Submit edited post, TO BE IMPLEMENTED
		e.preventDefault();
		console.log(JSON.stringify(post));
		const updateResponse = await fetch(apiURLS.update, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify({ title: post.title, content: post.content }),
		});
		if (updateResponse.ok) {
			// if successfull, redirect to profile page
			console.log("Successful Update.");
		} else {
			console.log("Error occured on update.");
		}
		afterEditSubmit();
	};

	// useEffect / ComponentDidMount hook to preload form with content if update
	useEffect(() => {
		if (props.editPost) {
			// if editing existing post, get post details and set to state which then prepopulates form
			getPostDetail();
		}
		// refresh cancel edit to null on remount of component
		setAfterEditLink(null);
	}, []);

	// use effect function just to see state for debugging purposes
	useEffect(() => {
		console.log(post);
	}, [post]);

	useEffect(() => {
		console.log(afterEditLink);
	}, [afterEditLink]);

	if (afterEditLink) {
		// redirect user after post submit, post edit, or cancel
		console.log("redirecting");
		return <Redirect to={`/profile/${afterEditLink}`} />;
	}

	return (
		<div className="main-container">
			<form className="post-form">
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						className="form-control"
						id="postTitle"
						type="text"
						name="title"
						onChange={handleChange}
						placeholder="blog post title"
						value={post.title}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="content">Content</label>
					<textarea
						className="form-control form-content"
						id="postContent"
						name="content"
						onChange={handleChange}
						placeholder="blog content"
						value={post.content}
						required
					/>
				</div>
				<div className="btn-container">
					{props.editPost ? (
						<div className="btn-container">
							<button
								className="btn btn-primary post-submit-btn"
								onClick={submitPostEdit}
							>
								Submit
							</button>
							<button
								className="btn btn-primary post-save-btn"
								onClick={afterEditSubmit}
							>
								Cancel
							</button>
						</div>
					) : (
						<div className="btn-container">
							<button
								className="btn btn-primary post-submit-btn"
								onClick={submitPost}
							>
								Submit
							</button>
							<button
								className="btn btn-primary post-save-btn"
								onClick={saveDraft}
							>
								Save Draft
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}

export default PostForm;
