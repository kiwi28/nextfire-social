import {
	getDocs,
	limit,
	orderBy,
	where,
	query,
	collection,
} from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { auth, db, getUserWithUsername, postToJson } from "../../lib/firebase";
import { Post, PostWFB, User } from "../../lib/types";

export async function getServerSideProps(props) {
	const { username } = props.query;

	const userDoc = await getUserWithUsername(username);
	const uid = userDoc.id;

	let user: Partial<User>;
	let posts: PostWFB[];

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = query(
			collection(db, "users", uid, "posts"),
			where("published", "==", true),
			orderBy("createdAt", "desc")
		);

		posts = (await getDocs(postsQuery)).docs.map(postToJson);

		return {
			props: {
				user,
				posts,
				uid,
			},
		};
	} else {
		return {
			notFound: true,
		};
	}
}

interface UserProfilePageProps {
	user: User;
	posts: Post[];
	uid: string;
}

export default function UserProfilePage({
	user,
	posts,
	uid,
}: UserProfilePageProps) {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} admin={uid == auth?.currentUser?.uid} />
		</main>
	);
}
