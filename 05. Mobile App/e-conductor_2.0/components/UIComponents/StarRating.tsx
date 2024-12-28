import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

// Define the props interface
interface StarRatingProps {
  rating: number; // The current rating value (e.g., 4.5)
  maxStars?: number; // The maximum number of stars (default is 5)
  starSize?: number; // The size of each star (default is 30)
  onRatingChange?: (rating: number) => void; // Callback when the rating changes
}

// Create the StarRating component
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  starSize = 18,
  onRatingChange,
}) => {
  // Store the current rating as a state
  const [currentRating, setCurrentRating] = useState(rating);

  // Helper function to render stars
  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(currentRating * 2) / 2;

    for (let i = 1; i <= maxStars; i++) {
      let starImage;
      if (i <= Math.floor(roundedRating)) {
        starImage = require("../../assets/icons/full_star.png");
      } else if (i === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
        starImage = require("../../assets/icons/half_star.png");
      } else {
        starImage = require("../../assets/icons/empty_star.png");
      }

      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)} // Handle the star press event
        >
          <Image
            source={starImage}
            style={[styles.star, { width: starSize, height: starSize }]} // Set size based on props
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  // Handle star press to update the rating
  const handleStarPress = (star: number) => {
    setCurrentRating(star); // Update the rating state
    if (onRatingChange) {
      onRatingChange(star); // Call the callback with the new rating
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{renderStars()}</View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    marginHorizontal: 2, // Space between stars
  },
});

export default StarRating;

// import React from "react";
// import { View, Image, StyleSheet } from "react-native";
// import { ThemedText } from "../CommonModules/ThemedText";

// // Define the props interface
// interface StarRatingProps {
//   rating: number; // The current rating value (e.g., 4.5)
//   maxStars?: number; // The maximum number of stars (default is 5)
//   starSize?: number; // The size of each star (default is 30)
// }

// // Create the StarRating component
// const StarRating: React.FC<StarRatingProps> = ({
//   rating,
//   maxStars = 5,
//   starSize = 18,
// }) => {
//   // Round the rating to the nearest half
//   const roundedRating = Math.round(rating * 2) / 2;

//   // Helper function to render stars
//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= maxStars; i++) {
//       let starImage;
//       if (i <= Math.floor(roundedRating)) {
//         starImage = require("@/assets/icons/full_star.png");
//       } else if (i === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
//         starImage = require("@/assets/icons/half_star.png");
//       } else {
//         starImage = require("@/assets/icons/empty_star.png");
//       }
      
//       stars.push(
//         <Image
//           key={i}
//           source={starImage}
//           style={[styles.star, { width: starSize, height: starSize }]} // Set size based on props
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.starsContainer}>{renderStars()}</View>
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10
//   },
//   starsContainer: {
//     flexDirection: "row",
//   },
//   star: {
//     marginHorizontal: 2, // Space between stars
//   },
// });

// export default StarRating;
