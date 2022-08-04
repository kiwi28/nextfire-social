import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJson } from "../lib/firebase";
import { Post } from "../lib/types";

const LIMIT = 20;
type HomeProps = {
	posts: Post[];
};

export async function getServerSideProps() {
	const postsQuery = firestore
		.collectionGroup("posts")
		.where("published", "==", true)
		.orderBy("createdAt", "desc")
		.limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJson);

	return {
		props: { posts },
	};
}

const Home: React.FC = (props: HomeProps) => {
	const [posts, setPosts] = useState<Post[]>(props.posts);
	const [loading, setLoading] = useState<boolean>(false);

	const [postsEnd, setPostsEnd] = useState<boolean>(false);

	const handleGetMorePosts = async () => {
		setLoading(true);
		const last: Post = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === "number"
				? fromMillis(last.createdAt)
				: last.createdAt;

		const query = firestore
			.collection("posts")
			.where("published", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts: Post[] = (await query.get()).docs.map(postToJson);

		setPosts(posts.concat(newPosts));

		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};

	return (
		<main>
			<PostFeed posts={posts} admin={false} />

			{!loading && !postsEnd && (
				<button onClick={handleGetMorePosts}>Load More!</button>
			)}

			<Loader show={loading} />

			{postsEnd && `You've reached the end!`}
		</main>
	);
};

export default Home;
