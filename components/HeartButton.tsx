import { doc, writeBatch } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db, increment } from "../lib/firebase";

export default function HeartButton({ postRef }) {
	// \/\/\/\/- to be continued tbc - \/\/\/
	const heartRef = doc(postRef, "hearts", auth.currentUser.uid);
	// const [value, loading, error] = useDocument(heartRef);
	const [heartDoc, loading, error, snap] = useDocumentData(heartRef);
	console.log("heartDoc", heartDoc);
	console.log("snap", snap);

	const addHeart = async () => {
		const uid = auth.currentUser.uid;
		const batch = writeBatch(db);

		batch.update(postRef, { heartCount: increment(1) });
		batch.set(heartRef, { uid });

		await batch.commit();
	};
	const removeHeart = async () => {
		const batch = writeBatch(db);

		batch.update(postRef, { heartCount: increment(-1) });
		batch.delete(heartRef);

		await batch.commit();
	};

	return heartDoc && snap?.exists ? (
		<button onClick={removeHeart}>💔 Unheart</button>
	) : (
		<button onClick={addHeart}>💗 Heart</button>
	);
}
