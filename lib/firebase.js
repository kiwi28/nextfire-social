import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


const firebaseConfig = {
	apiKey: "AIzaSyBkcs9Q4LpLgD3drCZGdSb0rqxpJcTtSQ0",
	authDomain: "nextreactfire-social.firebaseapp.com",
	projectId: "nextreactfire-social",
	storageBucket: "nextreactfire-social.appspot.com",
	messagingSenderId: "129351777238",
	appId: "1:129351777238:web:c2eba3cb494a42faee0277",
	measurementId: "G-SC9T4FD6FK"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

