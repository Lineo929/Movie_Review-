
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AddReview({ restaurantId, onAddReview }) {
  const [review, setReview] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    if (!user) {
      alert("You must be logged in to submit a review!");
      return;
    }

    const reviewData = {
      restaurantId,
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userEmail: user.email,
      text: review,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "reviews"), reviewData);

      
      if (onAddReview) {
        onAddReview({
          id: docRef.id,
          ...reviewData,
          createdAt: new Date(),
        });
      }

      setReview("");
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to submit review: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
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
