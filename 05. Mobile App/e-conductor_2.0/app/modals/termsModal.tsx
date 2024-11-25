import {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TermsAndConditions from "../../assets/docs/TermsAndConditions.json";
import Modal from "react-native-modal";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { ThemedView } from "../../components/CommonModules/ThemedView";

type Props = {
  isVisible: boolean;
  onClose: (event: GestureResponderEvent) => void;
};

export default function TermsModal({ isVisible, onClose }: Props) {
  const { termsAndConditions: terms } = TermsAndConditions;

  return (
    <Modal isVisible={isVisible}>
      <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
        <Pressable style={styles.cancelIcon} onPress={onClose}>
          <FontAwesomeIcon icon={faXmark} size={32} color={"gray"} />
        </Pressable>

        <ScrollView style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="h3" lightColor="#33aefc" darkColor="#33aefc">
              Terms and Conditions
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.sectionTitle}>Introduction</ThemedText>
          <ThemedText style={styles.text}>{terms.introduction}</ThemedText>

          <ThemedText style={styles.sectionTitle}>User Agreement</ThemedText>
          <ThemedText style={styles.text}>{terms.userAgreement}</ThemedText>

          <ThemedText style={styles.sectionTitle}>Changes to Terms</ThemedText>
          <ThemedText style={styles.text}>{terms.changesToTerms}</ThemedText>

          <ThemedText style={styles.sectionTitle}>
            User Responsibilities
          </ThemedText>
          <ThemedText style={styles.text}>
            Account Creation: {terms.userResponsibilities.accountCreation}
          </ThemedText>
          <ThemedText style={styles.text}>Prohibited Activities:</ThemedText>
          {terms.userResponsibilities.prohibitedActivities.map(
            (activity, index) => (
              <ThemedText key={index} style={styles.listItem}>
                {activity}
              </ThemedText>
            )
          )}

          <ThemedText style={styles.sectionTitle}>
            Intellectual Property
          </ThemedText>
          <ThemedText style={styles.text}>
            {terms.intellectualProperty}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            Limitation of Liability
          </ThemedText>
          <ThemedText style={styles.text}>
            {terms.limitationOfLiability}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>Privacy Policy</ThemedText>
          <ThemedText style={styles.text}>{terms.privacyPolicy}</ThemedText>

          <ThemedText style={styles.sectionTitle}>
            Contact Information
          </ThemedText>
          <ThemedText style={styles.text}>
            Email: {terms.contactInformation.email}
          </ThemedText>
          <ThemedText style={styles.text}>
            Phone: {terms.contactInformation.phone}
          </ThemedText>
          <ThemedText style={styles.text}>
            Address: {terms.contactInformation.address}
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
  listItem: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 5,
  },
});
