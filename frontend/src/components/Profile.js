import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PostCard from "./PostCard";

function Profile(props) {
	// set post link to redirect to page to edit post
	const [postLink, setPostLink] = useState(null);
	// flag for when deleting post fails, pop up modal window saying an error occured (TO BE IMPLEMENTED)
	const [deleteFailFlag, setDeleteFailFlag] = useState(null);
	const [profile, setProfile] = useState(null);
	// fetch profile information on useEffect
	const fetchData = async () => {
		let apiURL = `http://localhost:5000/user/${props.match.params.userID}`;
		const fetchResponse = await fetch(apiURL, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
		});
		if (fetchResponse.ok) {
			const profileData = await fetchResponse.json();
			setProfile(profileData);
		} else {
			console.log("Error fetching profile from database");
		}
	};

	useEffect(() => {
		// fetch profile information and set profile in state
		fetchData();
	}, []);

	useEffect(() => {
		setPostLink(null);
	}, []);
	// logging profile state for debugging reasons
	// useEffect(() => {
	// 	console.log(profile);
	// }, [profile]);

	const editPost = (e) => {
		e.preventDefault();
		setPostLink(e.target.id);
	};

	const deletePost = async (e) => {
		e.preventDefault();
		let deleteURL = `http://localhost:5000/post/delete-post/${e.target.id}`;
		const deleteResponse = await fetch(deleteURL, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${props.token}`,
			},
		});
		if (deleteResponse.ok) {
			console.log("successfully deleted");
			// delete successful, fetch updated profile to state
			fetchData();
		} else {
			console.log("Something went wrong with deletion process");
		}
	};

	if (postLink) {
		// redirect to post link, postlink with post id?
		return <Redirect to={`/edit/${postLink}`} />;
	}

	if (profile) {
		return (
			<div className="main-container">
				<div className="post-list">
					{profile.posts.map((post) => (
						<div className="profile-card-container" key={post._id}>
							<PostCard
								post={post}
								editable={true}
								editPost={editPost}
								deletePost={deletePost}
							/>
						</div>
					))}
				</div>
			</div>
		);
	} else {
		return <h1>Loading Profile</h1>;
	}
}

export default Profile;
