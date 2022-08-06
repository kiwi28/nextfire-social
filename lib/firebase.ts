import firebase from "firebase/compat/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
	collection,
	getDocs,
	getFirestore,
	limit,
	query,
	where,
} from "firebase/firestore";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBkcs9Q4LpLgD3drCZGdSb0rqxpJcTtSQ0",
	authDomain: "nextreactfire-social.firebaseapp.com",
	projectId: "nextreactfire-social",
	storageBucket: "nextreactfire-social.appspot.com",
	messagingSenderId: "129351777238",
	appId: "1:129351777238:web:c2eba3cb494a42faee0277",
	measurementId: "G-SC9T4FD6FK",
};

getApps().length === 0 && initializeApp(firebaseConfig);

export const app = getApp();
export const db = getFirestore(app);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage();

export async function getUserWithUsername(username: string) {
	const usersRef = collection(db, "users");
	const usersQuery = query(
		usersRef,
		where("username", "==", username),
		limit(1)
	);
	const userDoc = (await getDocs(usersQuery)).docs[0];

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
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
export const fromDate = firebase.firestore.Timestamp.fromDate;
