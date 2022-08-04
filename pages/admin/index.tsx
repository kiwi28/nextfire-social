import AuthCheck from "../../components/AuthCheck";
import kebabCase from "lodash/kebabCase";
import React, { useCallback, useState } from "react";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { Post } from "../../lib/types";
import { collection, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useUserDataCtx } from "../../lib/hooks";
import toast from "react-hot-toast";

import styles from "/styles/Admin.module.css";

export default function AdminPostsPage({}) {
	return (
		<main>
			<AuthCheck>
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
}

const PostList: React.FC = () => {
	// const postsRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts'); not working because of reasons
	const postsRef = collection(firestore, `users/${auth.currentUser.uid}/posts`);
	// const postsQuery = postsRef.orderBy('createdAt') not working because of reasons
	const postsQuery = query(postsRef, orderBy("createdAt"));
	// const [querySnapshot] = useCollection(collection(firestore, `users/${auth.currentUser.uid}/posts`))  not working because of reasons
	const [querySnapshot] = useCollection(postsQuery);

	const posts = querySnapshot?.docs.map((doc) => doc.data()) as Post[];

	return (
		<main>
			<PostFeed posts={posts} admin />
		</main>
	);
};

const CreateNewPost: React.FC = () => {
	const router = useRouter();
	const { username } = useUserDataCtx();
	const [title, setTitle] = useState("");

	const slug = encodeURI(kebabCase(title));
	const isValid = title.length > 3 && title.length < 100;

	const createPost = useCallback(
		async (e) => {
			e.preventDefault();
			const uid = auth.currentUser.uid;
			const ref = firestore
				.collection("users")
				.doc(uid)
				.collection("posts")
				.doc(slug);

			const data = {
				title,
				slug,
				uid,
				username,
				published: false,
				content: "# test hello world 123 Lorem ipsum",
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				heartCount: 0,
			};

			await toast.promise(ref.set(data), {
				loading: "Creating post...",
				success: "New post created succesfully",
				error: "Error creating post",
			});

			router.push(`/admin/${slug}`);
		},
		[slug, title, username, router]
	);

	return (
		<form onSubmit={createPost}>
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="My awesome article!"
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" className="btn-green" disabled={!isValid}>
				Create new post
			</button>
		</form>
	);
};
