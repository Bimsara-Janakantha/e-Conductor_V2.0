import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AboutUs from '@/assets/AboutUs.json';
import { ThemedText } from '@/components/CommonModules/ThemedText';

export default function About() {
  const { company } = AboutUs;

  return (
    <ScrollView style={styles.container}>
    <ThemedText style={styles.title}>{company.name}</ThemedText>
    <ThemedText style={styles.description}>{company.description}</ThemedText>

    <ThemedText style={styles.sectionTitle}>Features</ThemedText>
    <ThemedText style={styles.listItem}>User-Friendly Interface: {company.features.userFriendlyInterface ? 'Yes' : 'No'}</ThemedText>
    <ThemedText style={styles.listItem}>Multi-Language Support: {company.features.multiLanguageSupport.join(', ')}</ThemedText>
    <ThemedText style={styles.listItem}>Payment Methods: {company.features.paymentMethods.join(', ')}</ThemedText>
    <ThemedText style={styles.listItem}>Live Tracking: {company.features.liveTracking ? 'Yes' : 'No'}</ThemedText>
    <ThemedText style={styles.listItem}>Notifications: {company.features.notifications.join(', ')}</ThemedText>

    <ThemedText style={styles.sectionTitle}>Contact</ThemedText>
    <ThemedText style={styles.listItem}>Email: {company.contact.email}</ThemedText>
    <ThemedText style={styles.listItem}>Phone: {company.contact.phone}</ThemedText>
    <ThemedText style={styles.listItem}>Address: {company.contact.address}</ThemedText>

    <ThemedText style={styles.sectionTitle}>Social Media</ThemedText>
    <ThemedText style={styles.listItem}>Facebook: {company.socialMedia.facebook}</ThemedText>
    <ThemedText style={styles.listItem}>Twitter: {company.socialMedia.twitter}</ThemedText>
    <ThemedText style={styles.listItem}>Instagram: {company.socialMedia.instagram}</ThemedText>
  </ScrollView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});
