import { collection, doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";

export default function Heart({ postRef }) {
	const heartRef = doc(firestore, postRef, "hearts", auth.currentUser.uid);
	const [value, loading, error] = useDocument(heartRef);

	console.log;

	return (
		<div>
			heart:
			<p>
				{error && <strong>Error: {JSON.stringify(error)}</strong>}
				{loading && <span>Document: Loading...</span>}
				{value && <span>Document: {JSON.stringify(value.data())}</span>}
			</p>
		</div>
	);
}
