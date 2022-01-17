import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Menu, Provider, Divider, Switch } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import HomeHeader from "../components/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalContext from "../context/Context";

const ChatsScreen = () => {
	const navigation = useNavigation();

	const {
		theme: { colors, darkColors },
	} = useContext(GlobalContext);

	const [visible, setVisible] = useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	const [isSwitchOn, setIsSwitchOn] = useState(false);
	/*
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
*/
	const [mode, setMode] = useState(colors);
	function onToggleSwitch() {
		setIsSwitchOn(!isSwitchOn);
		{
			mode == colors ? setMode(darkColors) : setMode(colors);
		}
	}

	return (
		<Provider>
			<SafeAreaView
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: mode.background,
				}}
			>
				<View
					style={{
						width: "100%",
						height: 70,
						padding: 10,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							flex: 1,
							color: mode.foreground,
						}}
					>
						ChatApp
					</Text>
					<Menu
						visible={visible}
						onDismiss={closeMenu}
						anchor={
							<TouchableOpacity onPress={openMenu}>
								<Ionicons
									name="ellipsis-vertical"
									size={24}
									color={mode.foreground}
								/>
							</TouchableOpacity>
						}
					>
						<Menu.Item onPress={() => {}} title="New Group" />
						<Divider />
						<Menu.Item onPress={() => {}} title="Settings" />
					</Menu>
				</View>
				<Switch
					value={isSwitchOn}
					onValueChange={onToggleSwitch}
					color="purple"
				/>
				<Text style={{ flex: 1 }}>Chats Screen</Text>
				<StatusBar />
			</SafeAreaView>
		</Provider>
	);
};

export default ChatsScreen;

const styles = StyleSheet.create({});
