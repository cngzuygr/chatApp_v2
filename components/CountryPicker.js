import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import countries from "../data/countries.json";

export default function CountryPicker({
	selectedValue,
	setSelectedValue,
	setCountryCode,
}) {
	return (
		<Picker
			selectedValue={selectedValue}
			style={{ height: 50, width: "80%", alignSelf: "center" }}
			onValueChange={(itemValue, itemIndex) => (
				setSelectedValue(itemValue),
				setCountryCode(countries[itemIndex].dial_code.slice(1))
			)}
		>
			{countries.map((countries) => (
				<Picker.Item
					label={countries.name + " (" + countries.dial_code + ")"}
					value={countries.name}
					key={countries.name}
				/>
			))}
		</Picker>
	);
}
