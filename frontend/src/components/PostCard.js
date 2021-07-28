import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CommentCard from "./CommentCard";

function PostCard(props) {
	const [imgSrc, setImgSrc] = useState(null);
	const [profilePic, setProfilePic] = useState(null);
	const [comments, setComments] = useState(false);

	const arrayBufferToBase64 = (buffer) => {
		let binary = "";
		let bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
		return window.btoa(binary);
	};

	const showComments = () => {
		setComments(!comments);
	};

	// useEffect hook to set imgLink on component mount if there is image in post
	useEffect(() => {
		if (props.post.image) {
			let base64flag = "data:image/jpeg;base64, ";
			let source = base64flag + arrayBufferToBase64(props.post.image.data.data);
			setImgSrc(source);
		}
		if (props.post.user.profilePicture) {
			let base64flag = "data:image/jpeg;base64, ";
			let source =
				base64flag +
				arrayBufferToBase64(
					props.post.user.profilePicture.profilePicture.data.data
				);
			setProfilePic(source);
		}
		console.log(props);
	}, []);

	// used for debugging purposes, see if imgSrc is being set properly
	// useEffect(() => {
	// 	if (imgSrc) {
	// 		console.log(imgSrc);
	// 	}
	// }, [imgSrc]);

	return (
		<div className="card" key={props.post._id}>
			<div className="post-header-container">
				<img className="profile-pic" src={profilePic} alt="profile-pic"></img>
				<div className="post-header-info">
					<h1 className="card-title post-title">
						<Link className="react-link" to={`/post-detail/${props.post._id}`}>
							{props.post.title}
						</Link>
					</h1>
					<div className="sub-text">
						{props.editable ? null : (
							<small className="card-subtitle mb-2 text-muted user-subtitle">
								<Link
									className="react-link"
									to={`/profile/${props.post.user._id}`}
								>
									{props.post.user.username}
								</Link>
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
				</div>
			</div>
			<p className="card-text">{props.post.content}</p>
			{imgSrc ? (
				<img className="card-img-bottom post-image" src={imgSrc} alt="post" />
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
			<div className="comment-control">
				{/* Comments section to be implemented */}
				<div className="post-control">
					{props.commentable ? (
						<button
							className="btn btn-primary post-control-btn"
							id={props.post._id}
							onClick={props.commentPost}
						>
							{/* <svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-chat"
								viewBox="0 0 16 16"
							>
								<path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
							</svg> */}
							Comment
						</button>
					) : null}
					{props.commentsViewable ? (
						<button
							className="btn btn-secondary post-control-btn"
							onClick={showComments}
						>
							{`Show Comments (${props.post.comments.length})`}
						</button>
					) : null}
				</div>
			</div>
			{comments
				? props.post.comments.map((comment) => {
						// console.log(comment.user._id);
						// console.log(props.currentUserID);
						console.log(comment);
						return (
							<CommentCard
								key={comment._id}
								comment={comment}
								byCurrentUser={comment.user._id === props.currentUserID}
								delete={props.deleteComment}
								postID={props.post._id}
								pictureProcessor={arrayBufferToBase64}
							/>
						);
				  })
				: null}
		</div>
	);
}

export default PostCard;
