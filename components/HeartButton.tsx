import { doc, getDoc, writeBatch } from "firebase/firestore";
import { auth, db, increment } from "../lib/firebase";

export default async function HeartButton({ postRef }) {
	const heartRef = doc(postRef, "hearts", auth.currentUser.uid);
	// const [value, loading, error] = useDocument(heartRef);
	const heartDoc = await getDoc(heartRef);
	console.log(heartDoc);

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

	console.log("value.exists", heartDoc.exists);

	return heartDoc?.exists ? (
		<button onClick={removeHeart}>💔 Unheart</button>
	) : (
		<button onClick={addHeart}>💗 Heart</button>
	);
}
