import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	View,
	ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
	askPermission,
	pickImageCamera,
	pickImageLibrary,
	uploadImage,
} from "../utils";
import UpdateProfileModal from "../components/UpdateProfileModal";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const MAX_LENGTH = 24;

export default function UpdateProfileScreen() {
	const navigation = useNavigation();

	const [displayName, setDisplayName] = useState("");
	const [uploading, setUploading] = useState(false);

	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const ScrollView1 = useRef();

	//Image
	const [capturedImage, setCapturedImage] = useState(null);
	const [permissionStatus, setPermissionStatus] = useState(null);
	/*
	useEffect(() => {
		(async () => {
			const status = await askPermission();
			setPermissionStatus(status);
			console.log(status);
		})();
	}, []);
	*/
	async function handleCamera() {
		const result = await pickImageCamera();
		if (!result.cancelled) {
			setCapturedImage(result.uri);
		}
		setVisible(false);
	}

	async function handleImageLib() {
		const result = await pickImageLibrary();
		if (!result.cancelled) {
			setCapturedImage(result.uri);
		}
		setVisible(false);
	}

	async function handlePress() {
		setUploading(true);
		const user = auth?.currentUser;
		let photoURL;
		if (capturedImage) {
			const { url } = await uploadImage(
				capturedImage,
				`images/${user.uid}`,
				"profilePicture"
			);
			photoURL = url;
		}
		const userData = {
			displayName,
			phoneNumber: user?.phoneNumber,
		};
		if (photoURL) {
			userData.photoURL = photoURL;
		}

		await Promise.all([
			updateProfile(user, userData),
			setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
		]);
		setUploading(false);
		navigation.navigate("HomeScreen");
	}

	/*
	if (!permissionStatus) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="blue" />
			</View>
		);
	}

	if (permissionStatus !== "granted") {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>You need to allow this permission to upload image.</Text>
			</View>
		);
	}
	*/
	useEffect(() => {
		ScrollView1.current?.scrollToEnd();
	}, [displayName]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{ width: "100%" }} ref={ScrollView1}>
				<Text
					style={{
						alignSelf: "center",
						fontWeight: "bold",
						color: "gray",
						fontSize: 24,
						marginTop: 20,
						letterSpacing: 1,
					}}
				>
					Profile Info
				</Text>
				<Text
					style={{
						alignSelf: "center",
						textAlign: "center",
						marginTop: 40,
					}}
				>
					Please provide your name and an optional profile photo.
				</Text>
				{capturedImage == null ? (
					<TouchableOpacity
						style={{
							width: 150,
							height: 150,
							alignSelf: "center",
							borderRadius: 100,
							backgroundColor: "#ABABABaa",
							alignItems: "center",
							justifyContent: "center",
							marginTop: 50,
						}}
						onPress={showModal}
					>
						<Ionicons name="camera" size={36} color="white" />
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={{
							width: 150,
							height: 150,
							alignSelf: "center",
							borderRadius: 100,
							backgroundColor: "#ABABABaa",
							alignItems: "center",
							justifyContent: "center",
							marginTop: 50,
						}}
						onPress={showModal}
					>
						<Image
							style={{ width: "100%", height: "100%", borderRadius: 100 }}
							source={{ uri: capturedImage }}
							resizeMode="cover"
							resizeMethod="auto"
						/>
					</TouchableOpacity>
				)}
				<TextInput
					style={{
						width: "80%",
						height: 50,
						marginTop: 40,
						alignSelf: "center",
					}}
					label="Name"
					value={displayName}
					maxLength={MAX_LENGTH}
					mode="outlined"
					onChangeText={(text) => setDisplayName(text)}
					right={
						<TextInput.Affix
							textStyle={{
								marginTop: 5,
							}}
							text={MAX_LENGTH - displayName.length}
						/>
					}
				/>
				{!uploading ? (
					<TouchableOpacity
						style={{
							alignSelf: "center",
							width: "40%",
							height: 50,
							backgroundColor: `${displayName == "" ? "gray" : "#307351"}`,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 10,
							marginTop: 60,
							marginBottom: 40,
						}}
						disabled={displayName == "" || uploading}
						onPress={handlePress}
					>
						<Text style={{ color: "white", fontSize: 16 }}>Submit</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={{
							alignSelf: "center",
							width: "40%",
							height: 50,
							backgroundColor: `${displayName == "" ? "gray" : "#307351"}`,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 10,
							marginTop: 60,
							marginBottom: 40,
						}}
						disabled={displayName == "" || uploading}
						onPress={handlePress}
					>
						<ActivityIndicator size="large" color="white" />
					</TouchableOpacity>
				)}
			</ScrollView>
			<UpdateProfileModal
				visible={visible}
				hideModal={hideModal}
				handleCamera={handleCamera}
				handleImageLib={handleImageLib}
			/>
			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
});
