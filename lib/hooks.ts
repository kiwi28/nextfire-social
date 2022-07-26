import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect, useState } from "react";
import { auth, firestore } from "./firebase";
import { UserContext } from "./context";

export const useUserData = () => useContext(UserContext);

export const useUserDataMain = () => {
	const [user] = useAuthState<any>(auth);
	const [username, setUsername] = useState(null);

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
