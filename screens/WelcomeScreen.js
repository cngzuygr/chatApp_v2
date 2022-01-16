import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import CountryPicker from "../components/CountryPicker";
import WelcomeModal from "../components/WelcomeModal";
import { useNavigation } from "@react-navigation/native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app, phoneAuth } from "../firebase";

const WelcomeScreen = () => {
	const navigation = useNavigation();
	const recaptchaVerifier = useRef(null);

	const [visible, setVisible] = useState(false);
	const [selectedValue, setSelectedValue] = useState("Tunisia");
	const [countryCode, setCountryCode] = useState("");
	const [number, setNumber] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	useEffect(() => {
		setPhoneNumber("+" + countryCode + number);
	}, [countryCode, number]);

	useEffect(() => {
		setSelectedValue;
	}, [countryCode]);

	//Firebase phoneAuth verification send.
	async function handlePress() {
		await phoneAuth(phoneNumber, recaptchaVerifier, navCon);
	}

	//Captcha passed get verification navigate to verifying screen.
	async function navCon(verification) {
		navigation.navigate("VerifyScreen", verification);
	}

	return (
		<SafeAreaView
			style={{
				justifyContent: "center",
				alignItems: "center",
				flex: 1,
				backgroundColor: "white",
			}}
		>
			<ScrollView style={{}}>
				<Text style={styles.title}>Enter your phone number</Text>
				<Text style={styles.subTitle}>
					chatApp will send an SMS message to verify your phone number. Enter
					your country code and phone number:
				</Text>
				<CountryPicker
					selectedValue={selectedValue}
					setSelectedValue={setSelectedValue}
					setCountryCode={setCountryCode}
				/>
				<View
					style={{ width: "90%", alignSelf: "center", flexDirection: "row" }}
				>
					<TextInput
						style={{
							width: "32.5%",
							height: 60,
						}}
						value={countryCode}
						editable={false}
						onChangeText={(text) => setCountryCode(text)}
						selectionColor="#A594F9aa"
						maxLength={4}
						keyboardType="number-pad"
						left={
							<TextInput.Icon
								style={{ height: 20, alignSelf: "center" }}
								name="plus"
								size={16}
							/>
						}
					/>
					<TextInput
						style={{
							width: "62.5%",
							height: 60,
							marginLeft: "5%",
						}}
						selectionColor="#A594F9aa"
						label="phone number"
						keyboardType="number-pad"
						value={number}
						onChangeText={(text) => setNumber(text)}
					/>
				</View>
				<TouchableOpacity
					style={{
						alignSelf: "center",
						marginTop: 120,
						backgroundColor: `${phoneNumber.length < 6 ? "gray" : "#A594F9"}`,
						width: 130,
						height: 60,
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 8,
					}}
					disabled={phoneNumber.length < 6}
					onPress={showModal}
				>
					<Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
						Next
					</Text>
				</TouchableOpacity>
				<Text
					style={{ alignSelf: "center", marginTop: 20, color: "#0000005f" }}
				>
					Carrier SMS charges may apply.
				</Text>
				<StatusBar />
			</ScrollView>
			<WelcomeModal
				phoneNumber={phoneNumber}
				visible={visible}
				showModal={showModal}
				hideModal={hideModal}
				sendVerification={handlePress}
			/>
			<FirebaseRecaptchaVerifierModal
				ref={recaptchaVerifier}
				firebaseConfig={app.options}
			/>
		</SafeAreaView>
	);
};

export default WelcomeScreen;

const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		fontSize: 24,
		color: "gray",
		alignSelf: "center",
		marginTop: 20,
	},
	subTitle: {
		alignSelf: "center",
		textAlign: "center",
		fontSize: 14,
		marginTop: 20,
		marginHorizontal: 20,
	},
});
