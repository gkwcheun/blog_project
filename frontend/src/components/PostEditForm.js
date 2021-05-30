import { useState, useEffect } from "react";

function PostEditForm(props) {
	console.log(props.match.params.postID);
	// use props.match.params.postID and fetch post data put into form for editing.
	return <h1>Post Edit Form</h1>;
}

export default PostEditForm;
