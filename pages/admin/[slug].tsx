import React, { useState } from "react";
import { doc, DocumentReference, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";

import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";

import styles from "../../styles/Post.module.css";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import Link from "next/link";
import { PostWFB } from "../../lib/types";
import ImageUploader from "../../components/ImageUploader";

interface IFormInput {
	content: string;
	published: boolean;
}

interface IPostForm {
	defaultValues: PostWFB;
	postRef: DocumentReference;
	preview: boolean;
}

export default function AdminPostEdit(props) {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
}

function PostManager() {
	const [preview, setPreview] = useState<boolean>(false);

	const router = useRouter();
	const { slug } = router.query;

	const postRef = doc(firestore, `users/${auth.currentUser.uid}/posts/${slug}`);

	const [post] = useDocumentData(postRef);

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post as PostWFB}
							preview={preview}
						/>
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? "Edit" : "Preview"}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Live view</button>
						</Link>
						<DeletePostButton postRef={postRef} />
					</aside>
				</>
			)}
		</main>
	);
}

function PostForm({ defaultValues, postRef, preview }: IPostForm) {
	const { register, handleSubmit, formState, reset, watch } =
		useForm<IFormInput>({ defaultValues, mode: "onChange" });

	const { isValid, isDirty, errors } = formState;

	const updatePost = async ({ content, published }) => {
		await updateDoc(postRef, {
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });

		toast.success("Post updated successfully!");
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? styles.hidden : styles.controls}>
				<ImageUploader />

				<textarea
					name="content"
					{...register("content", {
						maxLength: { value: 20000, message: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" },
					})}
				></textarea>

				{errors.content && (
					<p className="text-danger">{errors.content.message}</p>
				)}

				<fieldset>
					<label htmlFor="published">Published</label>
					<input
						className={styles.checkbox}
						name="published"
						type="checkbox"
						{...register("published")}
					/>
				</fieldset>

				<button
					type="submit"
					className="btn-green"
					disabled={!isDirty || !isValid}
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}

function DeletePostButton({ postRef }) {
	const router = useRouter();

	const deletePost = async () => {
		const doIt = confirm("are you sure!");
		if (doIt) {
			await postRef.delete();
			router.push("/admin");
			toast("post annihilated ", { icon: "🗑️" });
		}
	};

	return (
		<button className="btn-red" onClick={deletePost}>
			Delete
		</button>
	);
}
