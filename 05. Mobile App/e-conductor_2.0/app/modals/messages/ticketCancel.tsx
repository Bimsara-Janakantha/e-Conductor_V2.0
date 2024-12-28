import { ThemedText } from "../../../components/CommonModules/ThemedText";
import { useAppContext } from "../../../context/AppContext";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
  Alert,
} from "react-native";
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onClose: (event: GestureResponderEvent) => void;
  refNo: string;
  billingDate: string;
  billingTime: string;
  cancelDate: string;
  cancelTime: string;
  duration: string;
  amount: string;
  refund: string;
};

export default function TicketCancelModal ({
  isVisible,
  onClose,
  refNo,
  billingTime,
  billingDate,
  cancelDate,
  cancelTime,
  duration,
  amount,
  refund,
}: Props) {

  const { baseURL} = useAppContext();

    // Function to handle refund confirmation
    const handleRefundConfirmation = async () => {
      if (!refNo || !refund || !cancelDate || !cancelTime) {
        Alert.alert('Error', 'Please fill in all the fields');
        return;
      }
  
      try {
        const response = await axios.post(`${baseURL}/transactions/trans2`, {
          data: {
            refNo: refNo,
            refund: parseFloat(refund),
            cancelDate: cancelDate,
            cancelTime: cancelTime,
          },
        });
        if (response.status === 200) {
          Alert.alert('Success', 'Refund processed successfully!');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Refund processing failed.');
      }
    };
  
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <ThemedText type="h4">Refund Request Form</ThemedText>
        <View style={{ marginVertical: 10 }}>
          <ThemedText type="h5" style={{ marginVertical: 3 }}>
            Billing Information
          </ThemedText>
          <ThemedText type="h6">Reference No: {refNo}</ThemedText>
          <ThemedText type="h6">
            Date of Purchase: {billingDate} at {billingTime}
          </ThemedText>
          <ThemedText type="h6">Billinng Amount: LKR {amount}</ThemedText>
        </View>
        <View style={{ marginVertical: 10 }}>
          <ThemedText type="h5" style={{ marginVertical: 3 }}>
            Refund Information
          </ThemedText>
          <ThemedText type="h6">
            Refund Request Date: {cancelDate} at {cancelTime}
          </ThemedText>
          <ThemedText type="h6">
            You have requested therefunnd after {duration}
          </ThemedText>
          <ThemedText type="h6">Refund Amount: LKR {refund}</ThemedText>
        </View>

        <Text style={{color: '#999', fontWeight: '600', fontStyle: 'italic'}}>Note: The refund amount is calculated based on our refund policy, which may include cancellation fees or deduction</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 35 }}>
          <Pressable style={styles.cancelIcon} onPress={onClose}>
            <ThemedText type="h5" lightColor="#2f9fff" darkColor="#2f9fff">BACK</ThemedText>
          </Pressable>
          <Pressable style={styles.cancelIcon} onPress={handleRefundConfirmation}>
            <ThemedText type="h5" lightColor="#2f9fff" darkColor="#2f9fff">AGREE & CONTINUE</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: -5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cancelIcon: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
});
