import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJson } from "../../lib/firebase";
import { Post, User } from "../../lib/types";

export async function getServerSideProps({ query }) {
	const { username } = query;

	const userDoc = await getUserWithUsername(username)

	let user: Partial<User>;
	let posts: Post[];

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = userDoc.ref
			.collection('posts')
			.where('published', '==', true)
			.orderBy('created_At', 'desc')
			.limit(5);

		posts = (await postsQuery.get()).docs.map(postToJson);

		return {
			props: {
				user, posts
			}
		}
	} else {
		return {
			notFound: true
		}
	}
}

interface UserProfilePageProps {
	user: User;
	posts: Post[];
}

export default function UserProfilePage({ user, posts }: UserProfilePageProps) {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} admin />
		</main>
	)
}