import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native-paper";

export default function UpdateProfileModal({
	visible,
	hideModal,
	handleCamera,
	handleImageLib,
}) {
	return (
		<Modal
			contentContainerStyle={{
				width: "70%",
				height: 150,
				justifyContent: "center",
				alignSelf: "center",
				backgroundColor: "white",

				borderRadius: 20,
			}}
			visible={visible}
			onDismiss={hideModal}
		>
			<TouchableOpacity
				style={{
					flex: 1,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "lightblue",

					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					borderBottomColor: "white",
					borderBottomWidth: 2,
				}}
				onPress={handleCamera}
			>
				<Text style={{ color: "white", fontSize: 20 }}>Pick from Camera</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					flex: 1,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "lightblue",
					borderBottomLeftRadius: 20,
					borderBottomRightRadius: 20,
				}}
				onPress={handleImageLib}
			>
				<Text style={{ color: "white", fontSize: 20 }}>Pick from Gallery</Text>
			</TouchableOpacity>
		</Modal>
	);
}
