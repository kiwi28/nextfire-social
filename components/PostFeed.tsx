import Link from "next/link";
import React from "react";
import { Post } from "../lib/types";

type PostFeedProps = {
	posts: Post[];
	admin: boolean;
};

export default function PostFeed({ posts, admin }: Partial<PostFeedProps>) {
	return (
		<>
			{posts ? (
				posts.map((post: Post) => <PostItem post={post} key={post.slug} />)
			) : (
				<p>No Posts</p>
			)}
		</>
	);
}

type PostItemProps = {
	post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
	const wordCount = post?.content.trim().split(/\s+/g).length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0);

	return (
		<div className="card">
			<Link href={`/${post.username}`}>
				<a>
					<strong>By @{post.username}</strong>
				</a>
			</Link>

			<Link href={`/${post.username}/${post.slug}`}>
				<a>
					<strong> @{post.title}</strong>
				</a>
			</Link>

			<footer>
				<span>
					{wordCount} words. {minutesToRead} min to read&nbsp;
				</span>
				<span>
					{" "}
					{"<3"} {post.heartCount} Hearts
				</span>
			</footer>
		</div>
	);
};
