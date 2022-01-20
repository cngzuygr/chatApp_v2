// @refresh reset
import { useRoute } from "@react-navigation/native";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { auth, db } from "../firebase";
import GlobalContext from "../context/Context";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";

const randomId = nanoid();

export default function ChatScreen() {
	const [roomHash, setRoomHash] = useState("");
	const [messages, setMessages] = useState([]);
	const {
		theme: { colors },
	} = useContext(GlobalContext);
	const { currentUser } = auth;
	const route = useRoute();
	const room = route.params.room;
	const selectedImage = route.params.image;
	const userB = route.params.user;

	const senderUser = currentUser.photoURL
		? {
				name: currentUser.displayName,
				_id: currentUser.uid,
				avatar: currentUser.photoURL,
		  }
		: { name: currentUser.displayName, _id: currentUser.uid };

	const roomId = room ? room.id : randomId;

	const roomRef = doc(db, "rooms", roomId);
	const roomMessagesRef = collection(db, "rooms", roomId, "messages");

	useEffect(() => {
		(async () => {
			if (!room) {
				const currUserData = {
					displayName: currentUser.displayName,
					phoneNumber: currentUser.phoneNumber,
				};
				if (currentUser.photoURL) {
					currUserData.photoURL = currentUser.photoURL;
				}
				const userBData = {
					displayName: userB.contactName || userB.displayName || "",
					phoneNumber: userB.phoneNumber,
				};
				if (userB.photoURL) {
					userBData.photoURL = userB.photoURL;
				}
				const roomData = {
					participants: [currUserData, userBData],
					participantsArray: [currentUser.phoneNumber, userB.phoneNumber],
				};
				try {
					await setDoc(roomRef, roomData);
				} catch (error) {
					console.log(error);
				}
			}
			const phoneHash = `${currentUser.phoneNumber}:${userB.phoneNumber}`;
			setRoomHash(phoneHash);
		})();
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(roomMessagesRef, (querySnapshot) => {
			const messagesFirestore = querySnapshot
				.docChanges()
				.filter(({ type }) => type == "added")
				.map(({ doc }) => {
					const message = doc.data();
					return { ...message, createdAt: message.createdAt.toDate() };
				});
		});
	}, []);

	const appendMessages = useCallback((messages) => {}, [messages]);

	return (
		<View>
			<Text>sa</Text>
		</View>
	);
}

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

	const { currentUser } = auth;
	const { rooms, setRooms } = useContext(GlobalContext);
	const contacts = useContacts();
	const {
		theme: { colors },
	} = useContext(GlobalContext);

	const chatsQuery = query(
		collection(db, "rooms"),
		where("participantsArray", "array-contains", currentUser.email)
	);
	useEffect(() => {
		const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
			const parsedChats = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				userB: doc
					.data()
					.participants.find((p) => p.email !== currentUser.email),
			}));
			setRooms(parsedChats);
		});
		return () => unsubscribe();
	}, []);

	function getUserB(user, contacts) {
		const userContact = contacts.find((c) => c.phoneNumber == user.phoneNumber);
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
