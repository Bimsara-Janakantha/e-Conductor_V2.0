import { View } from "react-native";
import { ThemedView } from "../CommonModules/ThemedView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ThemedText } from "../CommonModules/ThemedText";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type InputProps = {
  title: string;
  titleTextType?: "s3" | "s4" | "s5" | "s6" | "s7";
  iconName?: IconProp | null;

  iconSize?: number;
  iconColor: string;
  info: string;
  infoTextType?: "s3" | "s4" | "s5" | "s6" | "s7";
  infoLeftMargin?: number;
};

export const InfoCard = ({
  title,
  titleTextType = "s6",
  iconName = null,

  iconSize = 15,
  iconColor,
  info,
  infoTextType = "s5",
  infoLeftMargin = 30,
}: InputProps) => {
  return (
    <View style={{ paddingBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 10,
          alignItems: "center",
        }}
      >
        {iconName != null && (
          <FontAwesomeIcon icon={iconName} size={iconSize} color={iconColor} />
        )}

        <ThemedText
          type={titleTextType}
          lightColor={iconColor}
          darkColor={iconColor}
        >
          {title}
        </ThemedText>
      </View>
      <ThemedText
        type={infoTextType}
        lightColor="#000"
        darkColor="#fff"
        style={{ marginLeft: infoLeftMargin }}
      >
        {info}
      </ThemedText>
    </View>
  );
};
