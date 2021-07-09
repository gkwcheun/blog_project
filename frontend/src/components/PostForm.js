import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

// create and edit post form
// if editing, post form should prepopulate with content of original form
function PostForm(props) {
	const [post, setPost] = useState({ toBePublished: false });
	const [postImage, setPostImage] = useState(null);
	const [afterEditLink, setAfterEditLink] = useState(null);

	const apiURLS = {
		create: `http://localhost:5000/post/create-post`,
		update: `http://localhost:5000/post/update-post/${props.match.params.postID}`,
	};

	const handleChange = (e) => {
		if (e.target.name === "postImage") {
			setPostImage(e.target.files[0]);
		} else {
			let postData = { ...post, [e.target.name]: e.target.value };
			setPost(postData);
		}
	};

	const afterEditSubmit = (e = null) => {
		if (e) {
			e.preventDefault();
		}
		setAfterEditLink(props.userID);
	};

	const clearFields = () => {
		// clear form fields on submit
		let postTitle = document.getElementById("postTitle");
		postTitle.value = "";
		let postContent = document.getElementById("postContent");
		postContent.value = "";
		let postImage = document.getElementById("postImage");
		postImage.value = null;
	};

	const getFormData = () => {
		const formData = new FormData();
		formData.append("title", post.title);
		formData.append("content", post.content);
		if (postImage) {
			formData.append("postImage", postImage);
		}
		return formData;
	};

	const submitPost = async (e) => {
		// submit post data to database
		e.preventDefault();
		let formData = getFormData();
		formData.append("toBePublished", true);
		const postRequest = await fetch(apiURLS.create, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
			body: formData,
		});
		if (postRequest.ok) {
			// const postResponse = await postRequest.json();
			console.log("Successfully added post to database.");
		} else {
			console.log("Error adding post to database");
		}
		clearFields();
		setAfterEditLink(props.userID);
	};

	const saveDraft = async (e) => {
		e.preventDefault();
		// function to save non-published posts to DB
		// get formData, append toBePublished to be false for save draft
		let formData = getFormData();
		formData.append("toBePublished", false);
		const postRequest = await fetch(apiURLS.create, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
			body: formData,
		});
		if (postRequest.ok) {
			console.log("Successfully saved draft to database.");
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
			console.log(postData);
			let postState = {
				title: postData.post.title,
				content: postData.post.content,
				published: postData.post.published,
			};
			setPost({ ...postState });
		}
	};

	const submitPostEdit = async (e) => {
		// Submit edited post, TO BE IMPLEMENTED
		e.preventDefault();
		let formData = getFormData();
		if (e.target.name === "publish-btn") {
			formData.append("toBePublished", true);
		} else {
			formData.append("toBePublished", false);
		}
		const updateResponse = await fetch(apiURLS.update, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
			body: formData,
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
	// useEffect(() => {
	// 	console.log(post);
	// }, [post]);

	// use effect function just to see state for debugging purposes
	// useEffect(() => {
	// 	console.log(postImage);
	// }, [postImage]);

	// useEffect(() => {
	// 	console.log(afterEditLink);
	// }, [afterEditLink]);

	if (afterEditLink) {
		// redirect user after post submit, post edit, or cancel
		return <Redirect to={`/profile/${afterEditLink}`} />;
	}

	return (
		<div className="main-container">
			<form encType="multipart/form-data" className="post-form">
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
				<div className="form-group">
					<label htmlFor="postImage">Image</label>
					<input
						className="form-control-file"
						id="postImage"
						type="file"
						accept=".png .jpg .jpeg"
						name="postImage"
						onChange={handleChange}
					/>
					{props.editPost ? (
						<small className="card-subtitle mb-2 text-muted user-subtitle">
							Overwrites original image
						</small>
					) : null}
				</div>
				<input type="hidden" name="toBePublished" />
				<div className="btn-container">
					{props.editPost ? (
						<div className="btn-container">
							<button
								className="btn btn-primary post-submit-btn"
								name="publish-btn"
								onClick={submitPostEdit}
							>
								Publish
							</button>
							<button
								className="btn btn-primary post-save-btn"
								name="save-draft-btn"
								onClick={submitPostEdit}
							>
								Save Draft
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
