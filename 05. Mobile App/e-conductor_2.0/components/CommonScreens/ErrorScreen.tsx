import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, useColorScheme, View } from "react-native";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { ThemedView } from "../CommonModules/ThemedView";
import { faFrown } from "@fortawesome/free-solid-svg-icons";

type Prop = {
  error: string;
  retry: any;
};

export default function ErrorScreen({ error, retry: refresh }: Prop) {
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ marginTop: 200, alignItems: "center" }}>
        <FontAwesomeIcon
          icon={faFrown}
          size={60}
          color={theme == "dark" ? "#ddd" : "#777"}
          style={{ marginBottom: 20 }}
        />
        <View style={{ alignItems: "center", gap: 20, marginHorizontal: 20 }}>
          <ThemedText type="h5" lightColor="#777" darkColor="#ddd">
            Something went wrong, Please try again
          </ThemedText>
          <ThemedText type="s5" lightColor="#777" darkColor="#ddd">
            {error}
          </ThemedText>
          <Pressable
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: "#1090d0",
              borderRadius: 20,
            }}
            onPress={refresh}
          >
            <ThemedText type="h5" lightColor="#fff" darkColor="#fff">
              Retry
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}
