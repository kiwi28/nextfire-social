import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBkcs9Q4LpLgD3drCZGdSb0rqxpJcTtSQ0",
	authDomain: "nextreactfire-social.firebaseapp.com",
	projectId: "nextreactfire-social",
	storageBucket: "nextreactfire-social.appspot.com",
	messagingSenderId: "129351777238",
	appId: "1:129351777238:web:c2eba3cb494a42faee0277",
	measurementId: "G-SC9T4FD6FK",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export async function getUserWithUsername(username: string) {
	const usersRef = firestore.collection("users");
	const query = usersRef.where("username", "==", username).limit(1);
	const userDoc = (await query.get()).docs[0];

	return userDoc;
}

export const postToJson = (doc) => {
	const data = doc.data();
	return {
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis(),
	};
};

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
