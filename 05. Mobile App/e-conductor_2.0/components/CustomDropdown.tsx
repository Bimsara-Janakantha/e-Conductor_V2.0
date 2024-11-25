import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { ThemedText } from "./CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { accountType, useAppContext } from "../context/AppContext";

type DateType = {
  label: string;
  value: number;
};

type CustomDropdownProps = {
  data: DateType[];
  onSelect: Dispatch<SetStateAction<accountType>>;
};

export default function CustomDropdown({
  data,
  onSelect,
}: CustomDropdownProps) {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DateType>({
    label: "",
    value: 0,
  });
  const iconColor = "#fff";
  const iconSize = 17;

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const handleSelect = (item: DateType) => {
    setSelectedItem(item);
    setVisible(false);
    onSelect(item.label as accountType);
  };

  const renderItem = ({ item }: { item: DateType }) => (
    <Pressable style={styles.item} onPress={() => handleSelect(item)}>
      <ThemedText type="s5" lightColor={iconColor} darkColor={iconColor}>
        {item.label}
      </ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <ThemedText type="s5" lightColor={iconColor} darkColor={iconColor}>
            {"Switch Account"}
          </ThemedText>
          <FontAwesomeIcon
            icon={faChevronDown}
            size={iconSize}
            color={iconColor}
          />
        </View>
      </TouchableOpacity>
      {visible && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.value.toString()}
          style={styles.dropdown}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    margin: 20,
  },
  button: {
    backgroundColor: "#e28",
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginTop: 20,
    elevation: 3,
  },
  dropdown: {
    backgroundColor: "#e28",
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginVertical: 2,
    elevation: 3,
  },
  item: {
    padding: 10,
    alignItems: "center",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
