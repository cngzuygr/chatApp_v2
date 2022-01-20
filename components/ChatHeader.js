import { useRoute } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import GlobalContext from "../context/Context";
import Avatar from "./Avatar";

export default function ChatHeader() {
	const route = useRoute();

	const {
		theme: { colors },
	} = useContext(GlobalContext);
	return (
		<View style={{ flexDirection: "row" }}>
			<View>
				<Avatar size={37} user={route.params.user} />
			</View>
			<View
				style={{
					marginLeft: 12,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{ color: colors.background, fontWeight: "bold", fontSize: 16 }}
				>
					{route.params.user.contactName || route.params.user.displayName}
				</Text>
			</View>
		</View>
	);
}
