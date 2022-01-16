import { useAssets } from "expo-asset";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
	LogBox,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ContextWrapper from "./context/ContextWrapper";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Provider } from "react-redux";
import { store } from "./store";
import VerifyScreen from "./screens/VerifyScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import HomeScreen from "./screens/HomeScreen";

//Ignoring warning logs
LogBox.ignoreLogs([
	//Firestore issue
	"Setting a timer",
	//Auth issue
	"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);

//React navigation
const Stack = createStackNavigator();

function App() {
	const [currUser, setCurrUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setLoading(false);
			if (user) {
				setCurrUser(user);
			}
		});

		return () => unsubscribe;
	}, []);

	return (
		<>
			{!loading ? (
				<NavigationContainer style={styles.container}>
					{!currUser ? (
						<Stack.Navigator screenOptions={{ headerShown: false }}>
							<Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
							<Stack.Screen name="VerifyScreen" component={VerifyScreen} />
						</Stack.Navigator>
					) : (
						<Stack.Navigator screenOptions={{ headerShown: false }}>
							{!currUser.displayName && (
								<Stack.Screen
									name="UpdateProfileScreen"
									component={UpdateProfileScreen}
								/>
							)}
							<Stack.Screen name="HomeScreen" component={HomeScreen} />
						</Stack.Navigator>
					)}
				</NavigationContainer>
			) : (
				<View style={styles.container}>
					<ActivityIndicator size="large" color="yellow" />
					<StatusBar style="auto" />
				</View>
			)}
		</>
	);
}

function Main() {
	const [assets] = useAssets(
		require("./assets/icon-square.png"),
		require("./assets/user-icon.png")
	);
	return (
		<Provider store={store}>
			{!assets ? (
				<View style={styles.container}>
					<ActivityIndicator size="large" color="yellow" />
					<StatusBar style="auto" />
				</View>
			) : (
				<ContextWrapper>
					<App />
				</ContextWrapper>
			)}
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Main;
