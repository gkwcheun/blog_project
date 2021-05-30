import { Link } from "react-router-dom";
function PostCard(props) {
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
						<a href={`/profile/${props.post.user._id}`}>
							{props.post.user.username}
						</a>
					</small>
				)}
				<small className="card-subtitle mb-2 text-muted">
					{props.post.datePosted}
				</small>
			</div>
			<p className="card-text">{props.post.content}</p>
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
		</div>
	);
}

export default PostCard;
