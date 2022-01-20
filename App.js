import { useAssets } from "expo-asset";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
	LogBox,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ContextWrapper from "./context/ContextWrapper";
import GlobalContext from "./context/Context";
import { Provider } from "react-redux";
import { store } from "./store";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import WelcomeScreen from "./screens/WelcomeScreen";
import VerifyScreen from "./screens/VerifyScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import SendPhotoScreen from "./screens/SendPhotoScreen";
import ChatsScreen from "./screens/ChatsScreen";
import CallsScreen from "./screens/CallsScreen";
import ContactsScreen from "./screens/ContactsScreen";
import ChatScreen from "./screens/ChatScreen";
import ChatHeader from "./components/ChatHeader";

//Ignoring warning logs
LogBox.ignoreLogs([
	//Firestore issue
	"Setting a timer",
	//Auth issue
	"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);

//React navigation
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

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
						<Stack.Navigator>
							{!currUser.displayName && (
								<Stack.Screen
									name="UpdateProfileScreen"
									component={UpdateProfileScreen}
									options={{ headerShown: false }}
								/>
							)}
							<Stack.Screen
								name="HomeScreen"
								component={HomeScreen}
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="ContactsScreen"
								component={ContactsScreen}
								options={{
									title: "Select a Contact",
									headerStyle: { backgroundColor: "#e63946ff" },
									headerTintColor: "#f1faeeff",
								}}
							/>
							<Stack.Screen
								name="ChatScreen"
								component={ChatScreen}
								options={{
									headerTitle: (props) => <ChatHeader {...props} />,
									headerTintColor: "#f1faeeff",
									headerStyle: { backgroundColor: "#e63946ff" },
								}}
							/>
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

function HomeScreen() {
	const {
		theme: { colors },
	} = useContext(GlobalContext);

	return (
		<Tab.Navigator
			screenOptions={({ route }) => {
				return {
					tabBarLabel: () => {
						if (route.name === "SendPhotoScreen") {
							return (
								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Ionicons name="camera" size={20} color="white" />
								</View>
							);
						}
						if (route.name === "ChatsScreen") {
							return (
								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<MaterialIcons
										name="chat-bubble-outline"
										size={22}
										color="white"
									/>
									<Text style={{ color: "white", marginLeft: 5 }}>Chats</Text>
								</View>
							);
						}
						if (route.name === "CallsScreen") {
							return (
								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<MaterialIcons name="phone" size={22} color="white" />
									<Text style={{ color: "white", marginLeft: 5 }}>Calls</Text>
								</View>
							);
						}
					},
					tabBarShowIcon: true,
					tabBarLabelStyle: {
						color: "white",
					},
					tabBarIndicatorStyle: {
						backgroundColor: "yellow",
					},
					tabBarStyle: {
						backgroundColor: colors.foreground,
						width: "100%",
					},
				};
			}}
			tabBarPosition="bottom"
			initialRouteName="ChatsScreen"
		>
			<Tab.Screen name="SendPhotoScreen" component={SendPhotoScreen} />
			<Tab.Screen name="ChatsScreen" component={ChatsScreen} />
			<Tab.Screen name="CallsScreen" component={CallsScreen} />
		</Tab.Navigator>
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
