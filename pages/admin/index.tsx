import AuthCheck from "../../components/AuthCheck";
import kebabCase from "lodash/kebabCase";
import React, { useCallback, useState } from "react";
import { auth, db, serverTimestamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { Post } from "../../lib/types";
import { collection, doc, orderBy, query, setDoc } from "firebase/firestore";
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
	const postsRef = collection(db, `users/${auth.currentUser.uid}/posts`);
	const postsQuery = query(postsRef, orderBy("createdAt"));
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
			const ref = doc(db, "users", uid, "posts", slug);

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

			await toast.promise(setDoc(ref, data), {
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
