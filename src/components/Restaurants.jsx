
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

import Jays from "../assets/Jays.png";
import PiriPiri from "../assets/Piripiri.jfif";
import Lancers from "../assets/Lancers.jpg";
import Renaissance from "../assets/Renaissance.jpg";
import Avani from "../assets/Avani.jpg";
import Hakhojane from "../assets/Hakhojane.jpg";

const restaurants = [
  { id: 1, name: "Jays Restaurant", cuisine: "Basotho / International", rating: 4.0, image: Jays },
  { id: 2, name: "Piri Piri Portuguese Restaurant", cuisine: "Portuguese", rating: 3.9, image: PiriPiri },
  { id: 3, name: "Lancers Inn Restaurant", cuisine: "International", rating: 4.0, image: Lancers },
  { id: 4, name: "Renaissance Coffee & Café", cuisine: "Café / Light Meals", rating: 4.0, image: Renaissance },
  { id: 5, name: "The Pantry – Avani Maseru", cuisine: "Deli / Modern Bites", rating: 4.3, image: Avani },
  { id: 6, name: "Ha Khojane Restaurant", cuisine: "Basotho / International", rating: 4.5, image: Hakhojane },
];

export default function RestaurantDetails({ userLoggedIn, currentUser }) {
  const { id } = useParams();
  const restaurant = restaurants.find((r) => r.id === parseInt(id));

  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from Firestore
  const fetchReviews = async () => {
    const q = query(
      collection(db, "reviews"),
      where("restaurantId", "==", restaurant.id),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const fetchedReviews = querySnapshot.docs.map(doc => doc.data());
    setReviews(fetchedReviews);
  };

  useEffect(() => {
    if (restaurant) fetchReviews();
  }, [restaurant]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "reviews"), {
        restaurantId: restaurant.id,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        content: review,
        createdAt: new Date()
      });
      setReview("");
      fetchReviews(); // Refresh reviews
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="mt-4 p-4">
      <h2 className="mb-3">{restaurant.name}</h2>
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="img-fluid rounded mb-3"
        style={{ maxHeight: "300px", objectFit: "cover" }}
      />
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      <p><strong>Rating:</strong> {restaurant.rating} ⭐</p>

      <hr />

      <h4>Reviews</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <strong>{r.userEmail}:</strong> {r.content}
          </div>
        ))
      )}

      <hr />

      {userLoggedIn ? (
        <form onSubmit={handleSubmitReview}>
          <div className="mb-3">
            <label className="form-label">Add Your Review</label>
            <textarea
              className="form-control"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              required
            ></textarea>
          </div>
          <button className="btn btn-primary" type="submit">Submit Review</button>
        </form>
      ) : (
        <p className="text-warning">
          You must log in to add a review.
        </p>
      )}
    </div>
  );
}
