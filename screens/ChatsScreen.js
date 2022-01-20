import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Divider, Menu, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalContext from "../context/Context";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import CreateChatFloating from "../components/CreateChatFloating";
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import useContacts from "../hooks/useHooks";

export default function ChatsScreen() {
	//Options menu
	const [visible, setVisible] = useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);
	const {
		theme: { colors },
	} = useContext(GlobalContext);

	const { currentUser } = auth;
	const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);
	const contacts = useContacts();
	const chatsQuery = query(
		collection(db, "rooms"),
		where("participantsArray", "array-contains", currentUser.phoneNumber)
	);
	useEffect(() => {
		const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
			const parsedChats = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				userB: doc
					.data()
					.participants.find((p) => p.phoneNumber !== currentUser.phoneNumber),
			}));
			setUnfilteredRooms(parsedChats);
			setRooms(parsedChats.filter((doc) => doc.lastMessage));
		});
		return () => unsubscribe();
	}, []);

	function getUserB(user, contacts) {
		const userContact = contacts.find(
			(c) => c.phoneNumber === user.phoneNumber
		);
		if (userContact && userContact.contactName) {
			return { ...user, contactName: userContact.contactName };
		}
		return user;
	}

	return (
		<Provider>
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
				<View
					style={{
						width: "100%",
						height: 50,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							flex: 1,
							color: colors.foreground,
							marginLeft: 20,
						}}
					>
						ChatApp
					</Text>
					<Menu
						visible={visible}
						onDismiss={closeMenu}
						anchor={
							<TouchableOpacity onPress={openMenu} style={{ marginRight: 10 }}>
								<Ionicons
									name="ellipsis-vertical"
									size={24}
									color={colors.foreground}
								/>
							</TouchableOpacity>
						}
					>
						<Menu.Item onPress={() => {}} title="New Group" />
						<Divider />
						<Menu.Item onPress={() => {}} title="Settings" />
					</Menu>
				</View>
				{rooms.map((room) => (
					<ListItem
						type="chat"
						description={room.lastMessage.text}
						key={room.id}
						room={room}
						time={room.lastMessage.createdAt}
						user={getUserB(room.userB, contacts)}
					/>
				))}
				<CreateChatFloating />
			</SafeAreaView>
		</Provider>
	);
}
