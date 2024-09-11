import { Ticket } from "@/controller/Ticket";
import { ThemedText } from "../CommonModules/ThemedText";
import { ThemedView } from "../CommonModules/ThemedView";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { StringDate, StringTime } from "../CommonModules/StringDateTime";

type CreditCardProps = {
  ticket: Ticket;
};

export const CreditCardView = ({ ticket }: CreditCardProps) => {
  const theme = useColorScheme() ?? "light";
  const creditCardType = require("credit-card-type");

  const cardNumber = "5111111111111111";
  const cardNumberLast = "9650";
  const cardExp = "12/24";
  const cardHolderName = "Chamuditha Nawarathna";
  const cardInfo = creditCardType(cardNumber);

  const logos: any = {
    visa: require("@/assets/logos/V.png"),
    mastercard: require("@/assets/logos/MA.png"),
    "american-express": require("@/assets/logos/AMX.png"),
  };

  const cardColor: any = {
    visa: "#99a",
    mastercard: "#444",
    "american-express": "#1f70be",
  };

  const logoMarginBottomm: any = {
    visa: -15,
    mastercard: -10,
    "american-express": -10,
  };

  return (
    <View
      style={[
        styles.cardBody,
        { backgroundColor: cardColor[cardInfo[0].type] },
      ]}
    >
      <View style={{ marginLeft: 30, marginTop: 50 }}>
        <Image
          source={require("@/assets/images/credit_card_chip.png")}
          style={styles.chip}
        />
      </View>
      <View style={{ flexDirection: "column" }}>
        <ThemedText type="h3" style={{ alignSelf: "center" }} lightColor="#fff">
          XXXX XXXX XXXX {cardNumberLast}
        </ThemedText>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center", alignSelf: "center" }}>
            <ThemedText type="s9" lightColor="#fff">
              GOOD
            </ThemedText>
            <ThemedText type="s9" lightColor="#fff">
              THRU
            </ThemedText>
          </View>
          <ThemedText
            type="h5"
            lightColor="#fff"
            style={{ alignSelf: "center", marginLeft: 5 }}
          >
            {cardExp}
          </ThemedText>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <ThemedText
              type="s5"
              lightColor="#fff"
              style={{ alignSelf: "flex-end", marginLeft: 5 }}
            >
              {cardHolderName}
            </ThemedText>
          </View>
          <Image
            source={logos[cardInfo[0].type]}
            style={[
              styles.logo,
              { marginBottom: logoMarginBottomm[cardInfo[0].type] },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    elevation: 3,
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  collapsedTicketBody: {
    flex: 1,
    flexDirection: "row",
  },
  ticketStatus: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor: "#2c1",
    borderRadius: 10,
  },
  horizontalLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 5,
    borderWidth: 0,
    backgroundColor: "#aaa",
  },
  verticalLine: {
    flex: 0.02,
    marginHorizontal: 5,
    borderWidth: 0,
    backgroundColor: "#aaa",
  },
  barcode: {
    margin: 10,
    height: 50,
    width: 300,
    alignSelf: "center",
  },
  logo: {
    height: 60,
    width: 60,
    backgroundColor: "transparent",
    marginTop: -20,
  },
  chip: {
    height: 50,
    width: 50,
    backgroundColor: "transparent",
  },
});
