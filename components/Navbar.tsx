/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { auth } from "../lib/firebase";
import { useCallback } from "react";
import { useRouter } from "next/router";

import { useUserDataCtx } from "../lib/hooks";

export default function Navbar() {
	const { user, username } = useUserDataCtx()
	const router = useRouter()

	const handleSignOut = useCallback(() => {
		auth.signOut()
		router.reload()
	}, [router])

	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/">
						<button className="btn-logo">NXT</button>
					</Link>
				</li>

				{/* user is signed-in and has username */}
				{username && (
					<>
						<li className="push-left">
							<button onClick={handleSignOut}>Sign Out</button>
						</li>
						<li>
							<Link href="/admin">
								<button className="btn-blue">Write Posts</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`}>
								<img alt="profile picture" src={user?.photoURL || "/hacker.png"} />
							</Link>
						</li>
					</>
				)}

				{!username && (
					<li>
						<Link href="/enter">
							<button className="btn-blue">Log in</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
