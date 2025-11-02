import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


const restaurants = [
  { id: 1, name: "Jays Restaurant" },
  { id: 2, name: "Piri Piri Portuguese Restaurant" },
  { id: 3, name: "Lancers Inn Restaurant" },
  { id: 4, name: "Renaissance Coffee & Café" },
  { id: 5, name: "The Pantry – Avani Maseru" },
  { id: 6, name: "Ha Khojane Restaurant" },
];

export default function AddReview({ onAddReview, userData }) {
  const [review, setReview] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  useEffect(() => {
    if (restaurants.length > 0) setSelectedRestaurant(restaurants[0].id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    // Find restaurant name
    const restaurant = restaurants.find((r) => r.id === parseInt(selectedRestaurant));

    const reviewData = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      user: userData?.name || "Anonymous",
      email: userData?.email || "",
      text: review,
      timestamp: serverTimestamp(),
    };

    try {
      // Add review to Firestore
      await addDoc(collection(db, "reviews"), reviewData);

      // Update local state if needed
      if (onAddReview) onAddReview({ ...reviewData, id: Date.now() });

      setReview("");
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error adding review: ", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="restaurantSelect" className="form-label">
          Select Restaurant
        </label>
        <select
          id="restaurantSelect"
          className="form-select shadow-sm"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          style={{ borderRadius: "12px" }}
        >
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <textarea
          className="form-control shadow-sm"
          rows="3"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{ borderRadius: "12px" }}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit Review
      </button>
    </form>
  );
}
