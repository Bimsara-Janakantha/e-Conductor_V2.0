import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  TextInput,
  StyleSheet,
  useColorScheme,
  KeyboardTypeOptions,
  View,
  FlatList,
  Pressable,
  PressableProps,
} from "react-native";
import { ThemedText } from "../CommonModules/ThemedText";
import { ThemedView } from "../CommonModules/ThemedView";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { DateToString, TimeToString } from "../CommonModules/DateTimeToString";
import * as FileSystem from "expo-file-system";

const defaultSetDateTime: Dispatch<SetStateAction<Date>> = () => {};
const defaultSetString: Dispatch<SetStateAction<string>> = () => {};
const defaultSetBoolean: Dispatch<SetStateAction<boolean>> = () => {};
const defaultValidation = (
  input: string,
  setInput: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<boolean>>
) => {
  setInput(input);
  setError(false);
};

type InputProps = {
  title: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  error?: boolean;
  setError?: Dispatch<SetStateAction<boolean>>;
  errorMessage?: string;
  keyboardType?: KeyboardTypeOptions;
  validation?: (
    input: string,
    setInput: Dispatch<SetStateAction<string>>,
    setError: Dispatch<SetStateAction<boolean>>
  ) => void;
  maxLength?: number;
  placeholder?: string;
  nextFocus?: RefObject<TextInput>;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVerticle?: string;
};

export const FormInput = React.forwardRef<TextInput, InputProps>(
  (
    {
      nextFocus = undefined,
      title = "",
      input = "",
      setInput = defaultSetString,
      error = false,
      setError = defaultSetBoolean,
      errorMessage = "",
      keyboardType = "default",
      validation = defaultValidation,
      maxLength = 125,
      placeholder = "",
      multiline = false,
      numberOfLines = 1,
      textAlignVerticle = "center",
    },
    ref
  ) => {
    const theme = useColorScheme() ?? "light";
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View>
        <ThemedText type="h6" lightColor="#777" darkColor="#eee">
          {title}
        </ThemedText>
        <TextInput
          ref={ref}
          returnKeyType="next"
          style={[
            styles.inputField,
            error && { borderColor: "red" },
            isFocused && { borderColor: "#33aefc" },
            theme === "dark" && { backgroundColor: "#444", color: "#fff" },
            multiline && { height: numberOfLines * 40 },
          ]}
          value={input}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          textAlignVertical={
            textAlignVerticle as
              | "center"
              | "auto"
              | "top"
              | "bottom"
              | undefined
          }
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={theme === "dark" ? "#bbb" : "gray"}
          onChangeText={(text) => validation(text, setInput, setError)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={() => {
            nextFocus?.current?.focus();
          }}
          pointerEvents={"auto"}
        />
        <ThemedText style={[styles.formError, error && { color: "red" }]}>
          {errorMessage}
        </ThemedText>
      </View>
    );
  }
);

type DropdownProps = {
  title: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  dataList: { label: string; value: string }[];
  placeholder?: string;
};

export const FormDropdown = ({
  title = "",
  input = "",
  setInput = defaultSetString,
  dataList = [
    { label: "item 1", value: "1" },
    { label: "item 2", value: "2" },
    { label: "item 3", value: "3" },
  ],
  placeholder = "Select item",
}: DropdownProps) => {
  const theme = useColorScheme() ?? "light";
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <ThemedText type="h6" lightColor="#777" darkColor="#eee">
        {title}
      </ThemedText>
      <ThemedView
        style={{ backgroundColor: "transparent", paddingBottom: 15 }}
        pointerEvents={"auto"}
      >
        <Dropdown
          style={[styles.inputDropdown, isFocused && { borderColor: "#33aefc" },]}
          placeholderStyle={[
            { color: "gray" },
            theme === "dark" && { backgroundColor: "#444" },
          ]}
          data={dataList}
          labelField="label"
          valueField="value"
          placeholder={input == "" ? placeholder : input.valueOf()}
          value={input}
          onChange={(item) => {
            setInput(item.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </ThemedView>
    </View>
  );
};

type SearchProps = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  nextFocus?: RefObject<TextInput>;
  layer: number;
  iconName: IconDefinition | null;
};

export const BusStopSearchInput = React.forwardRef<TextInput, SearchProps>(
  (
    {
      nextFocus = undefined,
      input = "",
      layer = 1,
      setInput = defaultSetString,
      placeholder = "",
      iconName = null,
    },
    ref
  ) => {
    const theme = useColorScheme() ?? "light";
    const [isFocused, setIsFocused] = useState(false);
    const [busStops, setBusStops] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const folderUri = FileSystem.documentDirectory + "docs";
    const fileUri = folderUri + "/busStops.json";
    const loadBusStops = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        const parsedData = JSON.parse(fileContent);

        const stopNames = parsedData.map((stop: any) => stop.name);
        setBusStops(stopNames);
      } catch (error) {
        console.error("Failed to load bus stops: ", error);
      }
    };

    // UseEffect to load bus stops when the component mounts
    useEffect(() => {
      loadBusStops();
    }, []);

    const updateSearch = (text: string) => {
      setInput(text);

      if (text === "") {
        setFilteredData([]);
      } else {
        setFilteredData(
          busStops.filter((item) => {
            // Split the bus stop name by comma and take the first word
            const firstWord = item.split(",")[0]?.trim().toLowerCase();
            return firstWord.includes(text.toLowerCase());
          })
        );
      }
    };

    const selectResult = (input: string) => {
      setInput(input);
      setFilteredData([]);
    };

    return (
      <View style={{ zIndex: layer, position: "relative" }}>
        <View
          style={[
            styles.busSearchInput,
            theme === "dark" && {
              backgroundColor: "#444",
            },
            isFocused && { borderColor: "#33aefc" },
          ]}
        >
          <FontAwesomeIcon
            icon={iconName as IconProp}
            size={24}
            color={"gray"}
            style={{ marginRight: 7 }}
          />
          <TextInput
            ref={ref}
            returnKeyType="next"
            style={[styles.searchInput, theme === "dark" && { color: "#fff" }]}
            value={input}
            placeholder={placeholder}
            placeholderTextColor={theme === "dark" ? "#bbb" : "gray"}
            onChangeText={(text) => updateSearch(text)}
            onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
            onSubmitEditing={() => {
              nextFocus?.current?.focus();
            }}
            pointerEvents={"auto"}
          />
        </View>
        <FlatList
          style={styles.flatList}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.searchResult,
                theme === "dark" && {
                  backgroundColor: "#666",
                },
              ]}
            >
              <Pressable
                style={{ flexDirection: "row" }}
                onPress={() => selectResult(item)}
              >
                <ThemedText type="s5" lightColor="#000" darkColor="#fff">
                  {item.split(",")[0]?.trim()}
                </ThemedText>
                <ThemedText lightColor="#aaa" darkColor="#fff">
                  {", " + item.split(",")[1].trim()}
                  {", " + item.split(",")[2]?.trim()}
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}
        />
      </View>
    );
  }
);

type DateTimeSquareProps = {
  input: Date | null;
  setInput: Dispatch<SetStateAction<Date>>;
  placeholder?: string;
  iconName: IconDefinition | null;
  type: string;
  setOpenPicker: Dispatch<SetStateAction<boolean>>;
};

export function DateTimeInputSquare({
  input = null,
  setInput = defaultSetDateTime,
  placeholder = "",
  iconName = null,
  type = "Date",
  setOpenPicker = defaultSetBoolean,
}: DateTimeSquareProps) {
  const theme = useColorScheme() ?? "light";
  const [isFocused, setIsFocused] = useState(false);
  const updateInput = () => {
    setOpenPicker(true);
    setInput(new Date());
  };

  return (
    <View>
      <View
        style={[
          styles.dateTimeInputSquare,
          theme === "dark" && {
            backgroundColor: "#444",
          },
          isFocused && { borderColor: "#33aefc" },
        ]}
      >
        <FontAwesomeIcon
          icon={iconName as IconProp}
          size={24}
          color={"gray"}
          style={{ marginRight: 7 }}
        />
        <Pressable
          style={styles.searchInput}
          onPress={() => {
            updateInput();
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <ThemedText>
            {type == "Date" &&
              (input != null ? DateToString(input) : placeholder)}
            {type == "Time" &&
              (input != null ? TimeToString(input) : placeholder)}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

type DateTimeRoundProps = {
  input: Date | null;
  setInput: Dispatch<SetStateAction<Date>>;
  title: string;
  placeholder?: string;
  type: string;
  setOpenPicker: Dispatch<SetStateAction<boolean>>;
};

export function DateTimeInputRound({
  input = null,
  setInput = defaultSetDateTime,
  title = "",
  placeholder = "",
  type = "Date",
  setOpenPicker = defaultSetBoolean,
}: DateTimeRoundProps) {
  const theme = useColorScheme() ?? "light";
  const updateInput = () => {
    setOpenPicker(true);
    setInput(new Date());
  };

  return (
    <View>
      <ThemedText type="h6" lightColor="#777" darkColor="#eee">
        {title}
      </ThemedText>
      <View
        style={{
          width: 300,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "transparent",
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginBottom: 30,
          backgroundColor: theme === "dark" ? "#444" : "#fff",
          elevation: 3,
        }}
      >
        <Pressable
          style={styles.searchInput}
          onPress={() => {
            updateInput();
          }}
        >
          <ThemedText>
            {type == "Date" &&
              (input != null ? DateToString(input) : placeholder)}
            {type == "Time" &&
              (input != null ? TimeToString(input) : placeholder)}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    width: 300,
    color: "#333",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    elevation: 10,
  },
  dateTimeInputSquare: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 5,
    color: "#333",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  busSearchInput: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 5,
    color: "#333",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#fff",
    elevation: 3,
  },
  searchInput: {
    backgroundColor: "transparent",
    borderWidth: 0,
    width: 300,
  },
  flatList: {
    position: "absolute",
    top: 50, // Adjust this value based on the height of the search input
    left: 0,
    right: 0,
    marginHorizontal: 5,
    marginVertical: -2,
    zIndex: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  searchResult: {
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#fff",
    marginVertical: -1,
  },
  formError: {
    color: "transparent",
    marginBottom: 5,
  },
  inputDropdown: {
    width: 300,
    color: "#333",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
});
