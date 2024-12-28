import { ActivityIndicator, useColorScheme, View } from "react-native";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { ThemedView } from "../CommonModules/ThemedView";

export default function LoadingScreen() {
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ marginTop: 200, alignItems: "center" }}>
        <ActivityIndicator
          size={70}
          color={theme === "dark" ? "#ddd" : "#777"}
        />
      </View>

      <View style={{ margin: 10, alignItems: "center" }}>
        <ThemedText type="h5" lightColor="#777" darkColor="#ddd">
          Loading....
        </ThemedText>
      </View>
    </ThemedView>
  );
}
