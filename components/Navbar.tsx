/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useUserData } from "../lib/hooks";

export default function Navbar() {
	const { user, username } = useUserData()

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
							<button onClick={() => { }}>Sign Out</button>
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

				{/* user is not signed OR has not created username */}
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
