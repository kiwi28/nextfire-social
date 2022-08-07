import {
	collectionGroup,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { db, fromMillis, postToJson } from "../lib/firebase";
import { Post, PostWFB } from "../lib/types";

const LIMIT = 2;
type HomeProps = {
	posts: PostWFB[];
};

export async function getServerSideProps() {
	const postsQuery = query(
		collectionGroup(db, "posts"),
		where("published", "==", true),
		orderBy("createdAt", "desc"),
		limit(LIMIT)
	);

	const snapPosts = await getDocs(postsQuery);
	const posts = snapPosts.docs.map(postToJson);

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
		const last = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === "number"
				? fromMillis(last.createdAt)
				: last.createdAt;

		const postsQuery = query(
			collectionGroup(db, "posts"),
			where("published", "==", true),
			orderBy("createdAt", "desc"),
			startAfter(cursor),
			limit(LIMIT)
		);

		const querySnapPosts = await getDocs(postsQuery);

		const newPosts: Post[] = querySnapPosts.docs.map(postToJson);

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
