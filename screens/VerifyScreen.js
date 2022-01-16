import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	BackHandler,
	Alert,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CodeField,
	Cursor,
	useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { signUpPhone } from "../firebase";

const VerifyScreen = ({ route }) => {
	const verificationId = route.params;

	const [isUpdating, setIsUpdating] = useState(false);
	const [value, setValue] = useState("");
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	async function confirmCode() {
		setIsUpdating(true);
		await signUpPhone(verificationId, value, setIsUpdating);
	}

	useEffect(() => {
		const backAction = () => {
			Alert.alert("Hold on!", "Are you sure you want to exit app?", [
				{
					text: "Cancel",
					onPress: () => null,
					style: "cancel",
				},
				{ text: "YES", onPress: () => BackHandler.exitApp() },
			]);
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => backHandler.remove();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Text
					style={{
						alignSelf: "center",
						marginTop: 10,
						textAlign: "center",
						fontSize: 20,
						padding: 18,
					}}
				>
					We have sent you an SMS with a code to the number above.
				</Text>
				<Text
					style={{
						alignSelf: "center",
						marginTop: 10,
						textAlign: "center",
						fontSize: 16,
						padding: 10,
					}}
				>
					To complete your phone number verification, please enter the
					activation code.
				</Text>
				<CodeField
					{...props}
					value={value}
					onChangeText={setValue}
					cellCount={6}
					rootStyle={InputStyles.codeFiledRoot}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					renderCell={({ index, symbol, isFocused }) => (
						<View
							// Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
							onLayout={getCellOnLayoutHandler(index)}
							key={index}
							style={[InputStyles.cellRoot, isFocused && InputStyles.focusCell]}
						>
							<Text style={InputStyles.cellText}>
								{symbol || (isFocused ? <Cursor /> : null)}
							</Text>
						</View>
					)}
				/>
				{!isUpdating ? (
					<TouchableOpacity
						style={{
							alignSelf: "center",
							marginTop: 100,
							width: "40%",
							height: 50,
							backgroundColor: "#307351",
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 10,
						}}
						onPress={confirmCode}
					>
						<Text style={{ color: "white", fontSize: 16 }}>Verify</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={{
							alignSelf: "center",
							marginTop: 100,
							width: "40%",
							height: 50,
							backgroundColor: "#307351",
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 10,
						}}
						onPress={confirmCode}
						disabled={true}
					>
						<ActivityIndicator size="large" color="white" />
					</TouchableOpacity>
				)}
			</ScrollView>
			<StatusBar style="auto" />
		</SafeAreaView>
	);
};

export default VerifyScreen;

const styles = StyleSheet.create({});

const InputStyles = StyleSheet.create({
	root: { padding: 20, minHeight: 300 },
	codeFiledRoot: {
		marginTop: 20,
		width: "100%",
		marginLeft: "auto",
		marginRight: "auto",
	},
	cellRoot: {
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
		borderBottomColor: "#ccc",
		borderBottomWidth: 1,
	},
	cellText: {
		color: "#000",
		fontSize: 36,
		textAlign: "center",
	},
	focusCell: {
		borderBottomColor: "#007AFF",
		borderBottomWidth: 2,
	},
});
