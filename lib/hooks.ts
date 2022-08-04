import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect, useState } from "react";
import { auth, firestore } from "./firebase";
import { UserContext } from "./context";

export const useUserDataCtx = () => useContext(UserContext);

export const useUserDataFireBase = () => {
	const [user] = useAuthState<any>(auth);
	const [username, setUsername] = useState<string>(null);

	useEffect(() => {
		let unsubscribe: () => void;

		if (user) {
			const ref = firestore.collection("users").doc(user.uid);
			unsubscribe = ref.onSnapshot((doc) => {
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
};
