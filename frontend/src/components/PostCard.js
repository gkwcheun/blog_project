import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function PostCard(props) {
	const [imgSrc, setImgSrc] = useState(null);

	const arrayBufferToBase64 = (buffer) => {
		let binary = "";
		let bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
		return window.btoa(binary);
	};

	// useEffect hook to set imgLink on component mount if there is image in post
	useEffect(() => {
		if (props.post.image) {
			console.log("setting image source");
			let base64flag = "data:image/jpeg;base64, ";
			let source = base64flag + arrayBufferToBase64(props.post.image.data.data);
			setImgSrc(source);
		}
	}, []);

	// used for debugging purposes, see if imgSrc is being set properly
	useEffect(() => {
		if (imgSrc) {
			console.log(imgSrc);
		}
	}, [imgSrc]);

	return (
		<div className="card" key={props.post._id}>
			<h1 className="card-title">
				<Link className="react-link" to={`/post-detail/${props.post._id}`}>
					{props.post.title}
				</Link>
			</h1>
			<div className="sub-text">
				{props.editable ? null : (
					<small className="card-subtitle mb-2 text-muted user-subtitle">
						<span>By: </span>
						<a href={`/profile/${props.post.user._id}`}>
							{props.post.user.username}
						</a>
					</small>
				)}
				<small className="card-subtitle mb-2 text-muted">
					{props.post.datePosted}
				</small>
				<br />
				{props.post.published ? null : (
					<small className="card-subtitle mb-2 draft-text">
						<strong>DRAFT</strong>
					</small>
				)}
			</div>
			<p className="card-text">{props.post.content}</p>
			{imgSrc ? (
				<img className="card-img-bottom" src={imgSrc} alt="post image" />
			) : null}
			{props.editable ? (
				<div className="post-control">
					<button
						className="btn btn-primary post-control-btn"
						id={props.post._id}
						onClick={props.editPost}
					>
						Edit
					</button>
					<button
						className="btn btn-primary post-control-btn"
						id={props.post._id}
						onClick={props.deletePost}
					>
						Delete
					</button>
				</div>
			) : null}
			{/* Comments section to be implemented */}
		</div>
	);
}

export default PostCard;
