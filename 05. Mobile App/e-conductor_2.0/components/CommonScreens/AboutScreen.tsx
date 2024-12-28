import React from "react";
import { StyleSheet, ScrollView, useColorScheme } from "react-native";

import AboutUs from "../../assets/docs/AboutUs.json";
import { ThemedText } from "../../components/CommonModules/ThemedText";

export default function AboutScreen() {
  const theme = useColorScheme() ?? "light";
  const { company } = AboutUs;

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme === "dark" ? "#202020" : "#ffffff", padding: 20}}>
      <ThemedText style={styles.title}>{company.name}</ThemedText>
      <ThemedText style={styles.description}>{company.description}</ThemedText>

      <ThemedText style={styles.sectionTitle}>Features</ThemedText>
      <ThemedText style={styles.listItem}>
        User-Friendly Interface:{" "}
        {company.features.userFriendlyInterface ? "Yes" : "No"}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Multi-Language Support:{" "}
        {company.features.multiLanguageSupport.join(", ")}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Payment Methods: {company.features.paymentMethods.join(", ")}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Live Tracking: {company.features.liveTracking ? "Yes" : "No"}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Notifications: {company.features.notifications.join(", ")}
      </ThemedText>

      <ThemedText style={styles.sectionTitle}>Contact</ThemedText>
      <ThemedText style={styles.listItem}>
        Email: {company.contact.email}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Phone: {company.contact.phone}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Address: {company.contact.address}
      </ThemedText>

      <ThemedText style={styles.sectionTitle}>Social Media</ThemedText>
      <ThemedText style={styles.listItem}>
        Facebook: {company.socialMedia.facebook}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Twitter: {company.socialMedia.twitter}
      </ThemedText>
      <ThemedText style={styles.listItem}>
        Instagram: {company.socialMedia.instagram}
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});
