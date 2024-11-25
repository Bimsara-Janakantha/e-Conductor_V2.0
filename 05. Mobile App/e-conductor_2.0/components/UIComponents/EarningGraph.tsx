import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { LineChart, ruleTypes } from "react-native-gifted-charts";

type EarningsGraphProps = {
  data: { label: string; value: number }[];
};

type PointerItem = {
  label: string;
  value: number;
};

export const EarningsGraph: React.FC<EarningsGraphProps> = ({ data }) => {
  const theme = useColorScheme() ?? "light";

  const lineColor = theme === "dark" ? "#ff6347" : "#32cd32";
  const startColor = theme === "dark" ? "#ff8c00" : "#00ff7f";
  const endColor = theme === "dark" ? "#ffd700" : "#adff2f";
  const labelColor = theme === "dark" ? "#ccc" : "#777";

  return (
    <View style={{backgroundColor: theme === "dark" ? "#444" : "#fff", borderRadius: 20, paddingVertical: 25, elevation: 5}}>
      <LineChart
        areaChart
        data={data.map((item) => ({
          value: item.value,
          label: item.label, // Provide labels for the x-axis
        }))}
        width={300}
        adjustToWidth={true}
        color={lineColor}
        thickness={3}
        startFillColor={startColor}
        endFillColor={endColor}
        startOpacity={0.8}
        endOpacity={0.2}
        spacing={50}
        initialSpacing={5}
        noOfSections={6}
        stepHeight={50}
        yAxisThickness={0}
        xAxisColor="lightgray"
        yAxisTextStyle={{ color: labelColor }}
        xAxisLabelTextStyle={{ color: labelColor }}
        xAxisLabelsVerticalShift={10}
        rotateLabel
        rulesType={ruleTypes.SOLID}
        rulesColor={theme === "dark" ? "#888" : "#bbb"}
        hideDataPoints // Hides the black dots
        yAxisOffset={50}
        maxValue={Math.max(...data.map((d) => d.value)) + 1000} // Adjust max value dynamically
        pointerConfig={{
          pointerStripHeight: 300,
          pointerStripColor: lineColor,
          pointerStripWidth: 2,
          pointerColor: lineColor,
          radius: 6,
          pointerLabelComponent: (items: PointerItem[]) => {
            return (
              <View>
                {items[0].value != null && (
                  <View
                    style={{
                      height: 70,
                      width: 100,
                      justifyContent: "center",
                      backgroundColor: theme === "dark" ? "#ddd" : "#444",
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: theme === "dark" ? "#333" : "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {`Rs. ${items[0].value}`}
                    </Text>
                    <Text
                      style={{
                        color: theme === "dark" ? "#555" : "#ddd",
                        textAlign: "center",
                      }}
                    >
                      {items[0].label}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
    </View>
  );
};
