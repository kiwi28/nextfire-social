import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJson } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
	const { username } = query;

	const userDoc = await getUserWithUsername(username)

	let user = null;
	let posts = null;
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
	}
}

const UserProfilePage: React.FC = ({ user, posts }: any) => {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} admin />
		</main>
	)
}


export default UserProfilePage