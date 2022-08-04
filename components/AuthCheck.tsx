import Link from "next/link";
import { useUserDataCtx } from "../lib/hooks"

const AuthCheck = (props) => {
	const { username } = useUserDataCtx();
	return username ? props.children : props.fallback || <Link href="/enter">Go to login page</Link>

}

export default AuthCheck;