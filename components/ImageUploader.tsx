import { useState } from "react";
import {
	getDownloadURL,
	ref,
	StorageReference,
	uploadBytesResumable,
} from "firebase/storage";

import Loader from "./Loader";
import { auth, storage } from "../lib/firebase";
import toast from "react-hot-toast";

export default function ImageUploader() {
	const [uploading, setUploading] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [downloadURL, setDonwloadURL] = useState<string>(null);

	const handleUploadFile = async (e) => {
		const file = Array.from(e.target.files)[0] as Blob;
		const extension = file.type.split("/")[1];

		const fileRef = ref(
			storage,
			`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
		) as StorageReference;

		// start uploading
		setUploading(true);

		const uploadTask = uploadBytesResumable(fileRef, file);
		uploadTask.on(
			"state_changed",
			(snapShot) => {
				const uploadedPercent = parseInt(
					((snapShot.bytesTransferred / snapShot.totalBytes) * 100).toFixed(0)
				);
				setProgress(uploadedPercent);
			},
			(error) => {
				toast.error(error.message);
				console.dir(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("File available at", downloadURL);
					setUploading(false);
					setDonwloadURL(downloadURL);
				});
			}
		);
	};

	return (
		<div className="box">
			<Loader show={uploading} />
			{uploading && <h3>{progress}%</h3>}

			{!uploading && (
				<>
					<label className="btn">
						Upload Image
						<input
							type="file"
							onChange={handleUploadFile}
							accept="image/x-png,image/gif,image/jpeg,image/jpg"
						/>
					</label>
				</>
			)}

			{downloadURL && (
				<code className="upload-snippet">{`![alt](${downloadURL})`}</code>
			)}
		</div>
	);
}
