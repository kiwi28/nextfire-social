/* eslint-disable @next/next/no-img-element */

import { User } from "../lib/types";

interface UserProfileProps {
	user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
	return (
		<div className="box-center">
			<img src={user.photoURL || '/hacker.png'} className="card-img-center" alt="profile_img" />
			<p>
				<i>@{user.username}</i>
			</p>
			<h1>{user.displayName || 'Anonymous User'}</h1>
		</div>
	);
}

export default UserProfile;