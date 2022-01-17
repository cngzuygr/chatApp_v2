import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Menu, Provider, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeHeader(visible, openMenu, closeMenu) {
	return (
		<Provider>
			<Menu
				visible={visible}
				onDismiss={closeMenu}
				anchor={
					<TouchableOpacity onPress={() => openMenu}>
						<Ionicons name="ellipsis-vertical" size={24} color="black" />
					</TouchableOpacity>
				}
			>
				<Menu.Item onPress={() => console.log("sa")} title="New Group" />
				<Divider />
				<Menu.Item onPress={() => console.log("as")} title="Settings" />
			</Menu>
		</Provider>
	);
}

const styles = StyleSheet.create({});
