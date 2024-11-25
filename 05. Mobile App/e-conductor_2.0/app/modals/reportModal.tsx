import {
  Alert,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

import { ThemedText } from "../../components/CommonModules/ThemedText";
import {
  FormDropdown,
  FormInput,
} from "../../components/FormComponents/FormInputField";
import axios from "axios";
import Modal from "react-native-modal";
import { useAppContext } from "../../context/AppContext";

type Props = {
  isVisible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
  refNo: string;
};

export default function ReportModal({ isVisible, onClose, refNo }: Props) {
  const { baseURL, id } = useAppContext();
  const reportTypes = [
    { label: "Lost Item", value: "Lost Item" },
    { label: "Damaged item", value: "Damaged item" },
    { label: "Service", value: "Service" },
    { label: "Other", value: "Other" },
  ];
  const [reportType, setReportType] = useState("");
  const [report, setReport] = useState("");
  const [filled, setFilled] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 2 }, () => React.createRef<TextInput>())
  );

  //================================================ Functions ===============================================//

  // Update reports in the database when submit is pressed
  function pressSubmit() {
    updateBusReports(id, refNo, reportType, report);
    onClose();
  }

  //================================================ Backend Calls ===============================================//

  // Update bus reports in the database
  const updateBusReports = async (
    id: string,
    refNo: string,
    reportType: string,
    report: string
  ) => {
    try {
      const response = await axios.post(`${baseURL}/bus/report`, {
        userID: id,
        refNo,
        type: reportType,
        report,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Report sent successfully");
      } else {
        Alert.alert("Unsuccessful", "Failed to send report successfully");
      }
    } catch (error) {
      console.error("Error sending report:", error);
      Alert.alert("Error", "Failed to send the report");
    }
  };

  //================================================ Use Effects ===============================================//

  // Reset input fields
  useEffect(() => {
    setReportType("");
    setReport("");
  }, [isVisible]);

  // Check if all the fields are filled
  useEffect(() => {
    if (reportType != "" && report != "") {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [reportType, report]);

  //================================================ UI Control ===============================================//

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.5}
    >
      <Pressable style={styles.cancelIcon} onPress={onClose}>
        <FontAwesomeIcon icon={faXmark} size={32} color={"#ccc"} />
      </Pressable>
      <View style={styles.container}>
        <FormDropdown
          title="Report type"
          input={reportType}
          setInput={setReportType}
          dataList={reportTypes}
          placeholder="Select type"
        />
        <FormInput
          ref={inputRefs.current[0]}
          title="Report"
          input={report}
          setInput={setReport}
          multiline={true}
          numberOfLines={8}
          maxLength={500}
          textAlignVerticle="top"
          placeholder="Enter your report"
        />
        <Pressable
          style={[
            styles.submitButton,
            filled && { backgroundColor: "#1eceda" },
          ]}
          disabled={!filled}
          onPress={pressSubmit}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Submit
          </ThemedText>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
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
  submitButton: {
    alignItems: "center",
    backgroundColor: "gray",
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 30,
  },
  footer: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
  },
});
