function CommentCard(props) {
	const callDeleteComment = (e) => {
		e.preventDefault();
		props.delete(props.postID, props.comment._id);
	};
	return (
		<div className="card">
			<div className="card-body">
				<p className="card-text">{props.comment.comment}</p>
				<p className="card-subtitle mb-2 text-muted">
					{props.comment.user.username}
				</p>
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
