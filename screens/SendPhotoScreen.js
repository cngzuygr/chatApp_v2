import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SendPhotoScreen = () => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "white",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>Photo Screen</Text>
			<StatusBar />
		</View>
	);
};

export default SendPhotoScreen;

const styles = StyleSheet.create({});
