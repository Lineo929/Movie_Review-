import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";


const restaurants = [
  { id: 1, name: "Jays Restaurant" },
  { id: 2, name: "Piri Piri Portuguese Restaurant" },
  { id: 3, name: "Lancers Inn Restaurant" },
  { id: 4, name: "Renaissance Coffee & Café" },
  { id: 5, name: "The Pantry – Avani Maseru" },
  { id: 6, name: "Ha Khojane Restaurant" },
];

export default function RestaurantDetails({ userLoggedIn, userData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const r = restaurants.find((r) => r.id === parseInt(id));
    setRestaurant(r || null);
  }, [id]);

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  
  const handleAddReviewClick = () => {
    if (!userLoggedIn) {
      alert("You must log in to add a review!");
      navigate("/login");
      return;
    }
  };

  if (!restaurant) {
    return <p className="text-danger mt-4 container">Restaurant not found.</p>;
  }

  return (
    <div className="mt-4 container">
      <h2 className="mb-3">{restaurant.name} Details</h2>

      {userLoggedIn ? (
        <AddReview
          restaurantId={restaurant.id}
          onAddReview={handleAddReview}
          userData={userData}
        />
      ) : (
        <p className="text-danger">
          You must be logged in to add a review.
        </p>
      )}

      <Reviews reviews={reviews} />
    </div>
  );
}
