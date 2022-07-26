import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJson } from "../lib/firebase";

const LIMIT = 1;

export async function getServerSideProps() {
	const postsQuery = firestore
		.collectionGroup("posts")
		.where('published', '==', true)
		.orderBy("createdAt", "desc")
		.limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJson);

	return {
		props: { posts }
	}
}

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);

	const [postsEnd, setPostsEnd] = useState(false);

	const handleGetMorePosts = async () => {
		setLoading(true)
		const last = posts[posts.length - 1];

		const cursor = typeof last.createdAt === "number" ? fromMillis(last.createdAt) : last.createdAt;

		const query = firestore
			.collection("posts")
			.where("published", '==', true)
			.orderBy("createdAt", "desc")
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts = (await query.get()).docs.map(postToJson);

		setPosts(posts.concat(newPosts));

		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	}

	return (
		<main>
			<PostFeed posts={posts} admin={false} />

			{!loading && !postsEnd && <button onClick={handleGetMorePosts} >Load More!</button>}

			<Loader show={loading} />

			{postsEnd && `You've reached the end!`}
		</main >
	)
}

