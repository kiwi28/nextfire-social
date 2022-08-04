import { User as UserProfile } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
export interface User extends UserProfile {
	displayName: string;
	photoURL: string;
	username: string;
}

export interface Post {
	content: string;
	createdAt: Date;
	heartCount: number;
	published: boolean;
	slug: string;
	title: string;
	uid: string;
	updatedAt: Date;
	username: string;
}

// export interface PostWFB extends Post, DocumentData {}
export type PostWFB = Post & DocumentData;
