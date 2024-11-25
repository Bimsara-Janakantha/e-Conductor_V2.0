import { View, Text, useColorScheme } from "react-native";
import { LineChart, ruleTypes } from "react-native-gifted-charts";
import { ThemedText } from "../CommonModules/ThemedText";

type PointerItem = {
  date: string;
  value: number;
};

type LineGraphProps = {
  input: any;
  lineColorDark: string;
  lineColorLight: string;
  startColorDark: string;
  startColorLight: string;
  endColorDark: string;
  endColorLight: string;
  xSpacing: number;
  xLabelWidth: number;
  yLabelWidth: number;
};

export const LineGraph = ({
  input,
  lineColorDark = "#fff",
  lineColorLight = "#000",
  startColorDark = "#fff",
  startColorLight = "#000",
  endColorDark = "#fff",
  endColorLight = "#000",
  xSpacing = 45,
  xLabelWidth = 70,
  yLabelWidth = 45,
}: LineGraphProps) => {
  const theme = useColorScheme() ?? "light";

  const labelColor = theme === "dark" ? "#ccc" : "#777";

  return (
    <LineChart
      areaChart
      data={input}
      rotateLabel
      width={310}
      adjustToWidth={true}
      hideDataPoints
      color={theme === "dark" ? lineColorDark : lineColorLight}
      thickness={2}
      startFillColor={theme === "dark" ? startColorDark : startColorLight}
      endFillColor={theme === "dark" ? endColorDark : endColorLight}
      startOpacity={0.8}
      endOpacity={0.2}
      spacing={xSpacing} // Adjust the horizontal step size here
      initialSpacing={5}
      endSpacing={5}
      noOfSections={6}
      stepHeight={50}
      yAxisColor="white"
      yAxisThickness={0}
      rulesType={ruleTypes.SOLID}
      rulesColor={theme === "dark" ? "#888" : "#bbb"}
      yAxisTextStyle={{ color: labelColor }}
      yAxisTextNumberOfLines={2}
      // yAxisSide='right'
      xAxisColor="lightgray"
      yAxisLabelWidth={yLabelWidth}
      yAxisLabelContainerStyle={{
        paddingRight: 5, // Adjust this value to increase spacing
        justifyContent: "flex-end",
      }}
      xAxisLabelTextStyle={{ color: labelColor, width: xLabelWidth }}
      pointerConfig={{
        pointerStripHeight: 300,
        pointerStripColor: theme === "dark" ? "#fff" : "#666",
        pointerStripWidth: 2,
        pointerColor: theme === "dark" ? "#fff" : "#666",
        radius: 6,
        pointerLabelWidth: 100,
        pointerLabelHeight: 90,
        // activatePointersOnLongPress: true,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: PointerItem[]) => {
          return (
            <View>
              {items[0].value != null && (
                <View
                  style={{
                    height: 90,
                    width: 85,
                    justifyContent: "center",
                    // marginTop: -30,
                    // marginLeft: -40,
                  }}
                >
                  <ThemedText
                    type="h6"
                    lightColor="#666"
                    darkColor="#ddd"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {items[0].date}
                  </ThemedText>

                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: theme === "dark" ? "#ddd" : "#444",
                    }}
                  >
                    <ThemedText
                      type="s6"
                      lightColor="#fff"
                      darkColor="#333"
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {"Rs." + items[0].value}
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          );
        },
      }}
    />
  );
};
