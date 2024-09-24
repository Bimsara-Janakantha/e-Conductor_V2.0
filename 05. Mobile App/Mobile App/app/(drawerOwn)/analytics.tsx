import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { AppContext, useAppContext } from "@/context/AppContext";
import { LineGraph } from "@/components/UIComponents/LineGraph";

export default function Analytics() {
  const theme = useColorScheme() ?? "light";
  const { income7, income30, incomeYear } = useAppContext();
  
  return (
    <View style={styles.mainBody}>
      <ScrollView
        style={{
          backgroundColor: "transparent",
        }}
      >
        <View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            Income (7 days)
          </ThemedText>
          <LineGraph
            input={income7}
            lineColorDark="#0f8"
            lineColorLight="#0d8"
            startColorDark="#0f8"
            startColorLight="#0d8"
            endColorDark="#0f8"
            endColorLight="#0d8"
            xSpacing={55}
            xLabelWidth={90}
            yLabelWidth={45}
          />
        </View>

        <View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            Income (30 days)
          </ThemedText>
          <LineGraph
            input={income30}
            lineColorDark="#fa8"
            lineColorLight="#f98"
            startColorDark="#fa8"
            startColorLight="#f98"
            endColorDark="#fa8"
            endColorLight="#fa8"
            xSpacing={9}
            xLabelWidth={50}
            yLabelWidth={45}
          />
        </View>

        <View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            Income (Year)
          </ThemedText>
          <LineGraph
            input={incomeYear}
            lineColorDark="#f4f"
            lineColorLight="#f1f"
            startColorDark="#f4f"
            startColorLight="#f1f"
            endColorDark="#f4f"
            endColorLight="#f4f"
            xSpacing={27}
            xLabelWidth={50}
            yLabelWidth={45}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
  },
  rechargeButton: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cardBody: {
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  cardHeader: {
    marginTop: 25,
    marginBottom: 5,
    marginHorizontal: 15,
    backgroundColor: "transparent",
  },
  ticketBody: {
    borderWidth: 0,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    backgroundColor: "#1cd7",
  },
  drawerHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: "#000",
  },
});
