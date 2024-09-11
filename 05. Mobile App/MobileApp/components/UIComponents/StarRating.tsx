// StarRating.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedText } from "../CommonModules/ThemedText";

// Define the props interface
interface StarRatingProps {
  rating: number; // The current rating value (e.g., 4.5)
  ratingCount: number; // The current rating counnt (e.g., 100)
  maxStars?: number; // The maximum number of stars (default is 5)
  starSize?: number; // The size of each star (default is 30)
  filledStarColor?: string; // Color of filled stars (default is gold)
  emptyStarColor?: string; // Color of empty stars (default is gray)
  containerSize?: number; // The size of the entire StarRating view
}

// Create the StarRating component
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  ratingCount,
  maxStars = 5,
  starSize = 30,
  filledStarColor = "gold",
  emptyStarColor = "gray",
  containerSize = 30,
}) => {
  // Round up the rating to the nearest integer
  const roundedRating = Math.ceil(rating);

  // Helper function to render stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Text
          key={i}
          style={[
            i <= roundedRating ? styles.filledStar : styles.emptyStar,
            {
              paddingBottom: 2,
              fontSize: starSize,
              color: i <= roundedRating ? filledStarColor : emptyStarColor,
            },
          ]}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { height: containerSize }]}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      <ThemedText type="s6" style={{ textAlign: "center" }}>
        {ratingCount}
      </ThemedText>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "space-around",
  },
  starsContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  filledStar: {
    color: "gold",
  },
  emptyStar: {
    color: "gray",
  },
  ratingText: {
    marginLeft: 5,
    color: "black",
  },
});

export default StarRating;
