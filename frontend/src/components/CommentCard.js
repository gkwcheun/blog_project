import { useState, useEffect } from "react";

function CommentCard(props) {
	const [profilePic, setProfilePic] = useState(null);

	useEffect(() => {
		if (props.comment.user.profilePicture) {
			let base64flag = "data:image/jpeg;base64, ";
			let source =
				base64flag +
				props.pictureProcessor(
					props.comment.user.profilePicture.profilePicture.data.data
				);
			setProfilePic(source);
		}
	}, []);

	useEffect(() => {
		console.log(profilePic);
	}, [profilePic]);

	const callDeleteComment = (e) => {
		e.preventDefault();
		props.delete(props.postID, props.comment._id);
	};
	return (
		<div className="card">
			<div className="card-body">
				<div className="comment-header-container">
					<img className="comment-dp" src={profilePic}></img>
					<div className="comment-header-info">
						<p className="card-subtitle mb-2 text-muted">
							{props.comment.user.username}
						</p>
					</div>
				</div>
				<p className="card-text">{props.comment.comment}</p>
				<small className="card-subtitle mb-2 text-muted">
					{props.comment.datePosted}
				</small>
			</div>
			{props.byCurrentUser ? (
				<button
					className="btn btn-danger post-control-btn"
					onClick={callDeleteComment}
				>
					Delete
				</button>
			) : null}
		</div>
	);
}

export default CommentCard;
