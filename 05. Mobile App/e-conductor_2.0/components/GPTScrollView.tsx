import React, { PropsWithChildren, ReactElement, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Image, ImageSourcePropType } from 'react-native';
import { ThemedView } from './CommonModules/ThemedView';

type Props = PropsWithChildren<{
    headerImage: ImageSourcePropType;
    headerBackgroundColor: { dark: string; light: string };
  }>;
  
const { height: screenHeight } = Dimensions.get('window');

export default function ParallaxScrollView({
    children,
    headerImage,
    headerBackgroundColor,
  }: Props) {
  const scrollY = useRef(new Animated.Value(0)).current; // Track scroll position

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [300, 100], // Image will shrink from 300 to 100 in height
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0], // Image opacity fades out as you scroll down
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Parallax Header */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <Image
          source={headerImage}
          style={styles.headerImage}
        />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollViewContent: {
    paddingTop: 300, // Space for the header
  },
  content: {
    height: screenHeight * 2, // Just to make the content scrollable
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 20,
    color: '#000',
  },
});
