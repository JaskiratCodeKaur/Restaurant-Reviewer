import { useState, useLayoutEffect, useEffect } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,Alert,TextInput,KeyboardAvoidingView,Platform,}from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Rating } from "react-native-ratings";


/**
 * StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work.
 * No other person's work has been used without due acknowledgement.
 * I have not made my work available to anyone else.
 */

/**
 * Main component for displaying restaurant details and reviews
 */
const RestaurantDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurantId, restaurant, newReview } = route.params;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [rating, setRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  /**
   * Update navigation header dynamically based on the restaurant details
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#D3D3D3",
      },
      headerTintColor: "#000",
      title: restaurant ? restaurant.name : "Restaurant",
    });
  }, [navigation, restaurant]);

  /**
   * Fetch restaurant reviews when the component mounts or restaurantId changes
   */
  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  /**
   * Function to fetch reviews from the Google Maps API
   */
  const fetchReviews = async () => {
    try {
      const apiKey = "AIzaSyBRq8b1FjegwqCyZLEoQYuaOf6cYoXqV0c";
      const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${restaurantId}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      // Check if reviews exist and map them to a suitable format
      if (data && data.result && data.result.reviews) {
        const apiReviews = data.result.reviews.map((review) => ({
          userName: review.author_name || "Anonymous",
          rating: review.rating || 0,
          reviewText: review.text || "",
          userProfilePhoto: review.profile_photo_url || null,
        }));
        setReviews(apiReviews);
      } else {
        console.log("No reviews found.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  /**
   * Function to handle posting a new review
   */
  const handlePostReview = () => {
    const finalUserName = userName ? userName : "Anonymous";
    if (!rating || !reviewText) {
      alert("Please provide both a rating and a review text.");
      return;
    }
    const newReview = {
      userName: finalUserName,
      rating: rating,
      reviewText: reviewText,
      photo: photo || null,
    };
      // Add the new review to the existing reviews list
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setReviewText("");
      setUserName("");
      setPhoto(null);
      setRating(0);
      setShowReviewForm(false);
  };

  /**
   * Function to handle photo capture using the device camera
   */
  const handleTakePhoto = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      alert("We need camera and gallery access to proceed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  /**
   * Function to handle photo selection from the gallery
   */
  const handleSelectFromGallery = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      alert("We need camera and gallery access to proceed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  /**
   * Helper function to render star ratings visually
   */
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return (
      <View style={styles.rating}>
        {[...Array(fullStars)].map((_, index) => (
          <Ionicons key={`full-${index}`} name="star" size={20} color="#FFD700" />
        ))}
        {[...Array(halfStars)].map((_, index) => (
          <Ionicons key={`half-${index}`} name="star-half" size={20} color="#FFD700" />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Ionicons key={`empty-${index}`} name="star-outline" size={20} color="#FFD700" />
        ))}
      </View>
    );
  };

  /**
   * Main component Rendering restaurant details
   */
  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.bannerImage}
        source={{
          uri: restaurant && restaurant.photos && restaurant.photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=AIzaSyBRq8b1FjegwqCyZLEoQYuaOf6cYoXqV0c`
            : "https://via.placeholder.com/400x200?text=No+Image",
        }}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <View style={styles.rating}>
          {renderStars(restaurant.rating)}
          <Text style={styles.ratingText}>{restaurant.rating || "N/A"}</Text>
        </View>
        <Text style={styles.address}>📍{restaurant.vicinity}</Text>
      </View>

      <View style={styles.reviewsContainer}>
      <Text style={styles.reviewsTitle}>Reviews</Text>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewHeader}>
                  {/* Profile Image */}
                  <Image
                    source={
                      review.userProfilePhoto
                        ? { uri: review.userProfilePhoto }
                        : require('./assets/noUserProfile.jpg') // Path to the default picture
                    }
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  )}
                  {/* User Name */}
                  <Text style={styles.reviewAuthor}>{review.userName}</Text>
              )}
              </View>
            </View>
            <Text style={styles.reviewText}>
              {review.reviewText}
            </Text>
            {review.photo && (
                <Image source={{ uri: review.photo }} style={styles.reviewImage} resizeMode="cover" />
            )}
            <Text style={styles.reviewRating}>{renderStars(review.rating)}</Text>
          </View>
            ))
          ) : (
            <Text style={styles.noReviews}>No reviews yet.</Text>
          )}
        </View>

      {/* Button to Show the Review Form */}
      {!showReviewForm ? (
        <TouchableOpacity style={styles.submitButton} onPress={() => setShowReviewForm(true)}>
          <Text style={styles.submitButtonText}>Post a Review</Text>
        </TouchableOpacity>
      ) : (
        // Review Form
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <KeyboardAvoidingView
            style={styles.reviewForm}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Text style={styles.formTitle}>Write a Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name (Optional)"
              placeholderTextColor="#888"
              value={userName}
              onChangeText={setUserName}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Rate the restaurant:</Text>
              <Rating
                type="custom"
                ratingCount={5}
                imageSize={40}
                onFinishRating={setRating}
                startingValue={rating}
                style={{ backgroundColor: "transparent" }}
              />
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review here..."
              placeholderTextColor="#888"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <View style={styles.photoButtonsContainer}>
              <Text style={styles.photosLabel}>Choose a Photo (Optional):</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.photoButton, { backgroundColor: "#0066CC" }]}
                  onPress={handleSelectFromGallery}
                >
                  <Text style={styles.buttonText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
              {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handlePostReview}>
              <Text style={styles.submitButtonText}>Post Review</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    paddingBottom: 20 
  },
  bannerImage: { 
    width: "100%", 
    height: 200 
  },
  detailsContainer: { 
    padding: 15, 
    color: "#fff" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 5, 
    color: "#fff" 
  },
  rating: {
    flexDirection: "row",         
    marginHorizontal: 5,     
   
  },

  ratingText: { 
    fontSize: 16, 
    color: "#FFD700", 
    marginLeft: 5 
  },
  address: { 
    fontSize: 16, 
    color: "#888", 
    marginVertical: 5 
  },
  reviewsContainer: { 
    padding: 15 
  },
  reviewsTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  reviewCard: { 
    marginVertical: 10, 
    backgroundColor: "#222", 
    padding: 10, 
    borderRadius: 8,
    flexDirection: 'column', 
  },
  reviewAuthor: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  reviewRating: {
    flexDirection: 'row',      
    justifyContent: 'flex-end',   
    marginTop: 10,
    flex: 1,                      
  },
  reviewText: { 
    fontSize: 14, 
    color: "#bbb", 
    marginTop: 5 
  },
  noReviews: { 
    color: "#fff", 
    fontSize: 16 
  },
  submitButton: {
    backgroundColor: "#FFD700",   
    padding: 15,                  
    marginTop: 15,                
    borderRadius: 8,           
    width: 250,              
    alignSelf: 'center',    
    marginBottom: 30,
  },

  submitButtonText: { 
    color: "#000", 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  reviewForm: { 
    padding: 20 
  },

  formTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 15
  },
  input: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 10,
  },
  ratingContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    color: "#fff", 
    marginBottom: 10 
  },
  reviewInput: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    height: 100,
  },
  photoButtonsContainer: {
    flexDirection: 'row',         
    alignItems: 'center',        
    flexWrap: 'wrap', 
    justifyContent: 'center',    
             
  },

  photosLabel: {
    marginRight: 10, 
    color: "white",  
    alignItems: 'center',
    marginBottom: 20, 
  },

  buttonsContainer: {
    flexDirection: 'row',        
    justifyContent: 'center',    
    alignItems: 'center',      
  },

  photoButton: {
    backgroundColor: "#008CBA",   
    padding: 10,                 
    borderRadius: 8,             
    marginBottom: 10,            
    width: 150,                   
    marginHorizontal: 10,        
  },

  buttonText: {
    color: '#fff',              
    textAlign: 'center',    
  },

  photoPreview: {
    width: 100,               
    height: 100,
    borderRadius: 8,              
    marginTop: 10,  
  },
  reviewHeader: {
      flexDirection: 'row',      
      alignItems: 'center',   
      marginBottom: 5,
  },

  profileImage: {
      width: 30,  
      height: 30, 
      borderRadius: 15, 
      marginRight: 10, 
  },
  reviewImage: {
   width: 80,               
    height: 80,
    borderRadius: 8,              
    marginTop: 10,
  }
});

export default RestaurantDetails;
