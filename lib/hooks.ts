import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { UserContext } from "./context";
import { doc, onSnapshot } from "firebase/firestore";

export const useUserDataCtx = () => useContext(UserContext);

export const useUserDataFireBase = () => {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState<string>(null);

	useEffect(() => {
		let unsubscribe: () => void;

		if (user) {
			unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
};
