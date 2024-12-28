import { ThemedText } from "../../components/CommonModules/ThemedText";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useColorScheme,
  Alert,
  TextInput,
} from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { AccountDeatils } from "../../components/UIComponents/AccountDetails";

/**
 * Recharge Component for passengers
 * This component allows users to recharge their account using Google Pay or Apple Pay (for testing).
 * It initializes a payment sheet, handles payment sheet presentation, and performs payment.
 */
export default function Recharge() {
  const { baseURL, id } = useAppContext(); // Extracting global context values (baseURL and user ID)
  const theme = useColorScheme() ?? "light"; // Get current theme (light/dark)
  const { stripeKey, credits } = useAppContext(); // Access Stripe key and credits from app context
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Stripe hooks to handle payments
  const [isPaymentSheetReady, setIsPaymentSheetReady] = useState(false); // State to check if payment sheet is ready
  const [amount, setAmount] = useState(""); // State to store entered amount

  /**
   * Initializes the payment sheet with Google Pay.
   * It fetches the PaymentIntent client secret from the backend and sets up the payment sheet.
   *
   * @param userAmount - The amount the user wants to pay.
   */
  const initializePaymentSheet = async (userAmount: string) => {
    try {
      // Fetch PaymentIntent client secret from backend
      const response = await axios.post(
        `${baseURL}/tickets/create-payment-intent`,
        {
          amount: parseFloat(userAmount),
          currency: "lkr",
        }
      );

      const { clientSecret } = response.data;

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Your Merchant Name",
        googlePay: {
          currencyCode: "LKR",
          merchantCountryCode: "LK",
        },
      });

      if (!error) {
        setIsPaymentSheetReady(true);
      } else {
        console.error("Payment sheet initialization error:", error);
      }
    } catch (error) {
      console.error("Error initializing payment sheet:", error);
    }
  };

  /**
   * Handles Google Pay button press.
   * Initializes the payment sheet and presents it if ready.
   */
  const pressGooglePay = async () => {
    if (amount) {
      await initializePaymentSheet(amount);
    }

    if (isPaymentSheetReady) {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error: ${error.message}`);
      } else {
        Alert.alert("Success", "Your payment was successful!");
      }
    } else {
      Alert.alert("Error", "Payment sheet is not ready.");
    }
  };

  return (
    <StripeProvider publishableKey={stripeKey}>
      <ThemedView style={styles.container}>
        <AccountDeatils showRecharge={false} />
        <View style={{ margin: 20 }}>
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor={theme === "dark" ? "#fff" : "#000"}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={{
              borderWidth: 1,
              borderColor: theme === "dark" ? "#fff" : "#000",
              color: theme === "dark" ? "#fff" : "#000",
              borderRadius: 10,
              padding: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              marginVertical: 25,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                height: 2,
                backgroundColor: theme == "dark" ? "#ccc" : "#aaa",
              }}
            />
            <ThemedText type="h5" lightColor="#aaa" darkColor="#ccc">
              Paymeny Method
            </ThemedText>
            <View
              style={{
                flex: 1,
                height: 2,
                backgroundColor: theme == "dark" ? "#ccc" : "#aaa",
              }}
            />
          </View>
          <Pressable
            style={[
              styles.payButton,
              {
                backgroundColor: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            onPress={pressGooglePay}
          >
            <ThemedText type="h4" lightColor="#fff" darkColor="#000">
              Buy with
            </ThemedText>
            <Image
              source={require("../../assets/logos/google.png")}
              style={styles.googleLogo}
            />
            <ThemedText type="h4" lightColor="#fff" darkColor="#000">
              Pay
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.payButton,
              {
                backgroundColor: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            onPress={() => {}}
          >
            <ThemedText type="h4" lightColor="#fff" darkColor="#000">
              Buy with
            </ThemedText>
            <Image
              source={
                theme === "dark"
                  ? require("../../assets/logos/apple_dark.png")
                  : require("../../assets/logos/apple_light.png")
              }
              style={styles.appleLogo}
            />
            <ThemedText type="h4" lightColor="#fff" darkColor="#000">
              Pay
            </ThemedText>
          </Pressable>
          <Text
            style={{
              marginTop: 20,
              color: "#999",
              fontWeight: "600",
              fontStyle: "italic",
              textAlign: "justify",
            }}
          >
            Note: This is in a test environment. Payments made here are for
            testing purposes only and will not process any real transactions.
            Apple Pay functionality is not implemented
          </Text>
        </View>
      </ThemedView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  googleLogo: {
    width: 22,
    height: 22,
    margin: 8,
  },
  appleLogo: {
    width: 27,
    height: 22,
    margin: 8,
  },
  payButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
