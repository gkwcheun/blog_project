import { useState, useEffect } from "react";
// create and edit post form
// if editing, post form should prepopulate with content of original form
function PostForm(props) {
	const [post, setPost] = useState({ toBePublished: false });

	let apiURL = "http://localhost:5000/post/create-post";

	// use effect function just to see state for debugging purposes
	useEffect(() => {
		console.log(post);
	}, [post]);

	const handleChange = (e) => {
		let postData = { ...post, [e.target.name]: e.target.value };
		setPost(postData);
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
		const postRequest = await fetch(apiURL, {
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
	};

	const saveDraft = async (e) => {
		e.preventDefault();
		setPost({ ...post, toBePublished: false });
		// function to save non-published posts to DB
		const postRequest = await fetch(apiURL, {
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
	};

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
						placeholder="blog content title"
						value={post.content}
						required
					/>
				</div>
				<div className="btn-container">
					<button
						className="btn btn-primary post-submit-btn"
						onClick={submitPost}
					>
						Submit
					</button>
					<button className="btn btn-primary post-save-btn" onClick={saveDraft}>
						Save Draft
					</button>
				</div>
			</form>
		</div>
	);
}

export default PostForm;
