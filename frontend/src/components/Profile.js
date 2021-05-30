import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PostCard from "./PostCard";

function Profile(props) {
	// set post link to redirect to page to edit post
	const [postLink, setPostLink] = useState(null);
	const [profile, setProfile] = useState(null);
	// fetch profile information on useEffect
	useEffect(() => {
		// fetch profile information and set profile in state
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
		fetchData();
	}, []);
	useEffect(() => {
		setPostLink(null);
	}, []);
	// logging profile state for debugging reasons
	useEffect(() => {
		console.log(profile);
	}, [profile]);

	const editPost = (e) => {
		e.preventDefault();
		setPostLink(e.target.id);
	};

	const deletePost = (e) => {
		e.preventDefault();
		console.log("delete post route, to be implimented");
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
