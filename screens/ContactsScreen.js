import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ListItem from "../components/ListItem";
import GlobalContext from "../context/Context";
import { db } from "../firebase";
import useContacts from "../hooks/useHooks";

export default function ContactsScreen() {
	const contacts = useContacts();
	const route = useRoute();
	const {
		theme: { colors },
	} = useContext(GlobalContext);
	const image = route.params && route.params.image;
	return (
		<FlatList
			style={{ flex: 1, backgroundColor: colors.background }}
			data={contacts}
			keyExtractor={(_, i) => i}
			renderItem={({ item }) => <ContactPreview contact={item} image={image} />}
		/>
	);
}

function ContactPreview({ contact, image }) {
	const { rooms } = useContext(GlobalContext);
	const [user, setUser] = useState(contact);
	useEffect(() => {
		const q = query(
			collection(db, "users"),
			where("phoneNumber", "==", contact.phoneNumber)
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			if (snapshot.docs.length) {
				const userDoc = snapshot.docs[0].data();
				setUser(userDoc);
			}
			console.log(user);
		});
		return () => unsubscribe();
	}, []);

	return (
		<ListItem
			style={{ marginTop: 7 }}
			type="contacts"
			user={user}
			image={image}
			room={rooms.find((room) =>
				room.participantsArray.includes(contact.phoneNumber)
			)}
		/>
	);
}
