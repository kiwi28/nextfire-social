import Link from "next/link";

const PostFeed = ({ posts, admin }) => {

	return posts ? posts.map((post) => <PostItem post={post} key={post.slug} />) : <p>No Posts</p>
}


const PostItem = ({ post }) => {
	const wordCount = post?.content.trim().split(/\s+/g).length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0)
	return (
		<div className="card">
			<Link href={`/${post.username}`} >
				<a>
					<strong>By @{post.username}</strong>
				</a>
			</Link>

			<Link href={`/${post.username}/${post.slug}`} >
				<a>
					<strong>By @{post.title}</strong>
				</a>
			</Link>

			<footer>
				<span>
					{wordCount} words. {minutesToRead} min to read
				</span>
				<span> {'<3'} {post.hearCount} Hears</span>
			</footer>
		</div>
	)
}

export default PostFeed;