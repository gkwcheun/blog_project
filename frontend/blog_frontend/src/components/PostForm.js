import { useState } from "react";
// create and edit post form
// if editing, post form should prepopulate with content of original form
function PostForm(props) {
	const [post, setPost] = useState({ toBePublished: false });

	let apiURL = "http://localhost:5000/user/create-post";

	const handleChange = (e) => {
		if (e.target.name !== "publish") {
			let postData = { ...post, [e.target.name]: e.target.value };
			setPost(postData);
		} else {
			console.log(e.target.checked);
			let publishStatus = e.target.checked ? true : false;
			let postData = { ...post, toBePublished: publishStatus };
			setPost(postData);
		}
	};

	const clearFields = () => {
		// clear form fields on submit
		let postTitle = document.getElementById("postTitle");
		postTitle.value = "";
		let postContent = document.getElementById("postContent");
		postContent.value = "";
		let postCheckbox = document.getElementById("postCheckbox");
		postCheckbox.checked = false;
	};

	const submitPost = async (e) => {
		// submit post data to database
		e.preventDefault();
		console.log(post);
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
			<form>
				<label for="title" />
				<input
					id="postTitle"
					type="text"
					name="title"
					onChange={handleChange}
					placeholder="blog post title"
					value={post.title}
					required
				/>
				<label for="content" />
				<textarea
					id="postContent"
					name="content"
					onChange={handleChange}
					placeholder="blog content title"
					required
				/>
				<label for="publish" />
				<input
					id="postCheckbox"
					name="publish"
					type="checkbox"
					onChange={handleChange}
					placeholder="blog content title"
					required
				/>
				<button onClick={submitPost}>Submit</button>
			</form>
		</div>
	);
}

export default PostForm;
