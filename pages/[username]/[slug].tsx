import { Post } from '../../lib/types';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore, getUserWithUsername, postToJson } from '../../lib/firebase';

import PostContent from '../../components/PostContent';

import styles from '../../styles/Post.module.css';
import { doc, DocumentReference } from 'firebase/firestore';
import Metatags from '../../components/Metatags';

export async function getStaticProps({ params }) {
	const { username, slug } = params;

	const userDoc = await getUserWithUsername(username);

	let post: Post;
	let path: string;

	if (userDoc) {
		const postRef = userDoc.ref.collection('posts').doc(slug);
		post = postToJson(await postRef.get());

		path = postRef.path;

		return {

			props: {
				post,
				path,
			},
			revalidate: 5000
		}
	} else {
		return {
			notFound: true,
		}
	}

}

export async function getStaticPaths() {
	const snapshot = await firestore.collectionGroup('posts').get();

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();

		return {
			params: { username, slug }
		}
	})

	return {
		paths,
		fallback: 'blocking'
	}
}

interface PostPageProps {
	post: Post;
	path: string;
}

export default function PostPage(props: PostPageProps) {
	const postRef = doc(firestore, props.path)
	const [realtime] = useDocumentData(postRef);

	const post = realtime || props.post

	return (
		<main className={styles.container}>
			<Metatags title={post.title} description={post.content} image='https://picsum.photos/200' />

			<section>
				<PostContent post={post} />
			</section>

			<aside className="card">
				<p>
					<strong>{post.heartCount || 0} 🤍</strong>
				</p>

			</aside>
		</main>
	)
}

