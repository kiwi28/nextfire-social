import {
	collection,
	collectionGroup,
	doc,
	getDoc,
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
import { auth, db, fromMillis, postToJson } from "../lib/firebase";
import { Post, PostWFB } from "../lib/types";

const LIMIT = 10;
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
	console.log("last:------>", snapPosts.docs[snapPosts.docs.length - 1]);
	return {
		props: { posts },
	};
}

const Home: React.FC = (props: HomeProps) => {
	const [posts, setPosts] = useState<Post[]>(props.posts);
	const [loading, setLoading] = useState<boolean>(false);
	console.log(posts);

	const [postsEnd, setPostsEnd] = useState<boolean>(false);
	const handleGetMorePosts = async () => {
		setLoading(true);
		const lastJson = posts[posts.length - 1];
		const last = await getDoc(
			doc(db, "users", auth.currentUser.uid, "posts", lastJson.slug)
		);

		console.log("last------------>", last);
		// ? fromDate(new Date(last.createdAt))

		// const cursor =
		// 	typeof last.createdAt === "number"
		// 		? fromMillis(last.createdAt)
		// 		: last.createdAt;

		const postsQuery = query(
			collection(db, "posts"),
			where("published", "==", true),
			orderBy("createdAt", "desc"),
			startAfter(last),
			limit(LIMIT)
		);

		const querySnapPosts = await getDocs(postsQuery);

		const newPosts: Post[] = querySnapPosts.docs.map(postToJson);

		setPosts(posts.concat(newPosts));
		console.log("newPosts----------->", newPosts);
		// console.log("cursor	----------->", cursor);

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
