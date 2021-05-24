import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

function Profile(props) {
	// set post link to redirect to page to edit post
	const [postLink, setPostLink] = useState(null);
	const [profile, setProfile] = useState({});
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
				console.log("fetch response ok");
				const profileData = await fetchResponse.json();
				setProfile(profileData);
			} else {
				console.log("Error fetching profile from database");
			}
		};
		fetchData();
	}, [props.match.params.userID, props.token]);
	useEffect(() => {
		setPostLink(null);
	}, []);

	if (postLink) {
		// redirect to post link, postlink with post id?
		return <Redirect to={`/edit/${postLink}`} />;
	}

	return (
		<div className="main-container">
			<h1>Profile to be implemented</h1>
		</div>
	);
}

export default Profile;
