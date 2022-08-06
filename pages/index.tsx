// import {
// 	collectionGroup,
// 	getDocs,
// 	limit,
// 	orderBy,
// 	query,
// 	where,
// } from "firebase/firestore";
import {
	collectionGroup,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { db, fromMillis, postToJson } from "../lib/firebase";
import { Post } from "../lib/types";

const LIMIT = 20;
type HomeProps = {
	posts: Post[];
};

// v9
export async function getServerSideProps() {
	const postsQuery = query(
		collectionGroup(db, "posts"),
		where("published", "==", "true"),
		orderBy("createdAt", "desc"),
		limit(LIMIT)
	);
	//ask marius/stefan

	// v8
	// const postsQuery = db
	// 	.collectionGroup("posts")
	// 	.where("published", "==", true)
	// 	.orderBy("createdAt", "desc")
	// 	.limit(LIMIT);

	const snapPosts = await getDocs(postsQuery);
	console.log("snapPosts----------->", snapPosts);
	const posts = snapPosts.map(postToJson);

	// const querySnapshot2 = await getDocs(postsQuery);
	// const querySnapshot = await getDocs(postsQuery);
	// const posts = querySnapshot.docs.map(postToJson);
	// const posts = [];
	// console.log("------------>", querySnapshot2);

	// querySnapshot.forEach((doc) => {
	// doc.data() is never undefined for query doc snapshots
	// 	console.log(doc.id, " => ", doc.data());
	// 	posts.push(doc.data());
	// });

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
