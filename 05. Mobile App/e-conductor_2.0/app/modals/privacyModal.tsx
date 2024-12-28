import {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PrivacyPolicy from "../../assets/docs/PrivacyPolicy.json";
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onClose: (event: GestureResponderEvent) => void;
};

export default function PrivacyModal({ isVisible, onClose }: Props) {
  const { privacyPolicy: policy } = PrivacyPolicy;

  return (
    <Modal isVisible={isVisible}>
      <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
        <Pressable style={styles.cancelIcon} onPress={onClose}>
          <FontAwesomeIcon icon={faXmark} size={32} color={"gray"} />
        </Pressable>
        <ScrollView style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="h3" lightColor="#33aefc" darkColor="#33aefc">
              Privacy Policies
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.sectionTitle}>Introduction</ThemedText>
          <ThemedText style={styles.text}>{policy.introduction}</ThemedText>

          <ThemedText style={styles.sectionTitle}>
            Information Collection
          </ThemedText>
          <ThemedText style={styles.text}>
            Personal Information:{" "}
            {policy.informationCollection.personalInformation}
          </ThemedText>
          <ThemedText style={styles.text}>
            Device Information: {policy.informationCollection.deviceInformation}
          </ThemedText>
          <ThemedText style={styles.text}>
            Usage Data: {policy.informationCollection.usageData}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>Data Usage</ThemedText>
          <ThemedText style={styles.text}>
            Purpose: {policy.dataUsage.purpose}
          </ThemedText>
          <ThemedText style={styles.text}>
            Sharing: {policy.dataUsage.sharing}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>User Rights</ThemedText>
          <ThemedText style={styles.text}>
            Access: {policy.userRights.access}
          </ThemedText>
          <ThemedText style={styles.text}>
            Correction: {policy.userRights.correction}
          </ThemedText>
          <ThemedText style={styles.text}>
            Deletion: {policy.userRights.deletion}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>Security</ThemedText>
          <ThemedText style={styles.text}>{policy.security}</ThemedText>

          <ThemedText style={styles.sectionTitle}>Changes to Policy</ThemedText>
          <ThemedText style={styles.text}>{policy.changesToPolicy}</ThemedText>

          <ThemedText style={styles.sectionTitle}>
            Contact Information
          </ThemedText>
          <ThemedText style={styles.text}>
            Email: {policy.contactInformation.email}
          </ThemedText>
          <ThemedText style={styles.text}>
            Phone: {policy.contactInformation.phone}
          </ThemedText>
          <ThemedText style={styles.text}>
            Address: {policy.contactInformation.address}
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  titleContainer: {
    backgroundColor: "transparent",
    padding: 10,
    alignItems: "center",
  },
  cancelIcon: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
