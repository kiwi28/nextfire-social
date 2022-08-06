/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import { auth, db, googleAuthProvider } from "../lib/firebase";
import { useUserDataCtx, useUserDataFireBase } from "../lib/hooks";
import debounce from "lodash/debounce";
import toast from "react-hot-toast";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

export default function EnterPage() {
	const { user, username } = useUserDataFireBase();
	return (
		<main>
			{user ? (
				!username ? (
					<UsernameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
}

const SignInButton = () => {
	const signInWithGoogle = async () => {
		await signInWithPopup(auth, googleAuthProvider);
	};

	return (
		<button className="btn-google" onClick={signInWithGoogle}>
			<img src={"/google.png"} alt="google_logo" />
			Sign in with google
		</button>
	);
};

const SignOutButton = () => {
	return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

const UsernameForm = () => {
	const [formValue, setFormValue] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const { user, username } = useUserDataCtx();

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		const userDoc = doc(db, `users/${user.uid}`);
		const usernameDoc = doc(db, `usernames/${formValue}`);

		try {
			const batch = writeBatch(db);

			batch.set(userDoc, {
				username: formValue,
				photoURL: user.photoURL,
				displayName: user.displayName,
			});
			batch.set(usernameDoc, { uid: user.uid });

			await toast.promise(batch.commit(), {
				loading: "Loading...",
				success: "Username saved.",
				error: "Uh oh, there was an error!",
			});
		} catch (e) {
			toast.error(e.message);
			console.dir(e);
		}
	};

	const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
		const val = (e.target as HTMLInputElement).value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const checkUsername = useCallback(
		debounce(async (username: string) => {
			if (username?.length >= 3) {
				const ref = doc(db, `usernames/${username}`);
				const { exists } = await getDoc(ref);
				console.log("Firestore read executed!");
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[]
	);

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue, checkUsername]);

	return (
		!username && (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={handleSubmit}>
					<input
						name="username"
						placeholder="username"
						value={formValue}
						onChange={handleChange}
					/>
					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>
					<button type="submit" className="btn-green" disabled={!isValid}>
						Choose
					</button>
					<h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div>
				</form>
			</section>
		)
	);
};

function UsernameMessage({ username, isValid, loading }) {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className="text-success">{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className="text-danger">That username is taken!</p>;
	} else {
		return <p></p>;
	}
}
