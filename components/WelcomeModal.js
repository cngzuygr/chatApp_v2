import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, TextInput } from "react-native-paper";

export default function WelcomeModal({
	phoneNumber,
	visible,
	hideModal,
	sendVerification,
}) {
	return (
		<Modal
			visible={visible}
			onDismiss={hideModal}
			contentContainerStyle={{
				backgroundColor: "white",
				padding: 20,
				width: "95%",
				alignSelf: "center",
			}}
		>
			<Text>We are going to send a verification code to this number:</Text>
			<Text
				style={{
					marginTop: 10,
					alignSelf: "center",
					fontWeight: "bold",
					fontSize: 16,
				}}
			>
				{phoneNumber}
			</Text>
			<Text style={{ marginTop: 20, alignSelf: "center" }}>
				Are you sure this is correct?
			</Text>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-between",
					marginTop: 5,
				}}
			>
				<TouchableOpacity onPress={hideModal} style={{ alignItems: "center" }}>
					<Text style={{ color: "red" }}>No</Text>
					<Text style={{ color: "red" }}>(Edit Number)</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={sendVerification}
					style={{ alignItems: "center" }}
				>
					<Text style={{ color: "green" }}>Yes</Text>
					<Text style={{ color: "green" }}>(Send Confirmation)</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({});
