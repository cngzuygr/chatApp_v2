import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalContext from "../context/Context";
import { useNavigation } from "@react-navigation/native";
export default function CreateChatFloating() {
	const {
		theme: { colors },
	} = useContext(GlobalContext);

	const navigation = useNavigation();
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("ContactsScreen")}
			style={{
				position: "absolute",
				right: 20,
				bottom: 20,
				borderRadius: 60,
				width: 60,
				height: 60,
				backgroundColor: colors.foreground,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<MaterialCommunityIcons
				name="android-messages"
				size={30}
				color={colors.background}
				style={{ transform: [{ scaleX: -1 }] }}
			/>
		</TouchableOpacity>
	);
}
