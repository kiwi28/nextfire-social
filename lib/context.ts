import { createContext } from "react";
import { User } from "./types";

export const UserContext = createContext<{
	user: Partial<User>;
	username: string;
}>({
	user: null,
	username: null,
});
UserContext.displayName = "UserDataFirebase";
