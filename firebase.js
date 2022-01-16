import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithCredential,
	PhoneAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
import { FIREBASE_API_KEY } from "@env";

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: "gonder-3f888.firebaseapp.com",
	databaseURL:
		"https://gonder-3f888-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "gonder-3f888",
	storageBucket: "gonder-3f888.appspot.com",
	messagingSenderId: "263266528080",
	appId: "1:263266528080:web:4059d248491eb4e267da55",
	measurementId: "G-5Z4EZFRP5Z",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
	experimentalForceLongPolling: true,
});

//Send verification code and receive verification id
export async function phoneAuth(phoneNumber, recaptchaVerifier, navCon) {
	const phoneProvider = new PhoneAuthProvider(auth);
	const verification = await phoneProvider.verifyPhoneNumber(
		phoneNumber,
		recaptchaVerifier.current
	);
	if (verification) {
		navCon(verification);
	}
}

//confirm verification id and set a user on firebase auth
export async function signUpPhone(verificationId, value, setIsUpdating) {
	const credential = PhoneAuthProvider.credential(verificationId, value);
	signInWithCredential(auth, credential).catch(
		(error) => alert(error.message),
		setIsUpdating(false)
	);
}
