import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function pickImageCamera() {
	let result = ImagePicker.launchCameraAsync();
	return result;
}

export async function pickImageLibrary() {
	let result = ImagePicker.launchImageLibraryAsync();
	return result;
}

export async function askPermission() {
	const [status] = await ImagePicker.requestCameraPermissionsAsync();
	return status;
}

export async function uploadImage(uri, path, fName) {
	// Why are we using XMLHttpRequest?
	// See:  https://github.com/expo/expo/issues/2402#issuecomment-443726662
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError("Network request failed"));
		};
		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send(null);
	});

	const fileName = fName || nanoid();
	const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

	const snapshot = await uploadBytes(imageRef, blob, {
		contentType: "image/jpeg",
	});

	blob.close();

	const url = await getDownloadURL(snapshot.ref);

	return { url, fileName };
}

const lightTheme = {
	imperialred: "#e63946ff",
	honeydew: "#f1faeeff",
	powderblue: "#a8dadcff",
	celadonblue: "#457b9dff",
	prussianblue: "#1d3557ff",
};

const darkTheme = {
	imperialred: "#e63946ff",
	honeydew: "#f1faeeff",
	powderblue: "#a8dadcff",
	celadonblue: "#457b9dff",
	prussianblue: "#1d3557ff",
};

export const theme = {
	colors: {
		background: lightTheme.honeydew,
		foreground: lightTheme.imperialred,
		bottomTabs: lightTheme.prussianblue,
	},
	darkColors: {
		background: darkTheme.imperialred,
		foreground: darkTheme.honeydew,
		bottomTabs: darkTheme.prussianblue,
	},
};
