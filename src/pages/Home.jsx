
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";


import { FaStar, FaSearch, FaUsers, FaCommentDots } from "react-icons/fa";


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

export default function Home({ userLoggedIn }) {
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!userLoggedIn) return;
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "reviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setUserReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      }
    };

    fetchUserReviews();
  }, [userLoggedIn, auth]);

  const handleAddReview = (id) => {
    if (!userLoggedIn) {
      alert("You must log in to add a review!");
      navigate("/login");
      return;
    }
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="mt-4">
      
      {userLoggedIn && userReviews.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3">Your Recent Reviews</h4>
          <div className="row">
            {userReviews.map((rev) => {
              const restaurant = restaurants.find((r) => r.id === rev.restaurantId);
              return (
                <div key={rev.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100 shadow-sm p-2">
                    <img
                      src={restaurant?.image}
                      className="card-img-top"
                      alt={restaurant?.name}
                      style={{
                        height: "150px",
                        objectFit: "cover",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      }}
                    />
                    <div className="card-body">
                      <h6 className="card-title">{restaurant?.name || "Unknown Restaurant"}</h6>
                      <p className="card-text text-truncate mb-0">{rev.text}</p>
                      <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                        {rev.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Restaurants Section */}
      <h2 className="mb-4">Restaurants in Maseru</h2>
      <div className="row">
        {restaurants.map((r) => (
          <div key={r.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={r.image}
                className="card-img-top"
                alt={r.name}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{r.name}</h5>
                <p className="card-text mb-1"><strong>Cuisine:</strong> {r.cuisine}</p>
                <p className="card-text mb-1"><strong>Rating:</strong> {r.rating} ⭐</p>
                <div className="mt-3">
                  {userLoggedIn && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddReview(r.id)}
                    >
                      Add Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

   
      <div
        className="mt-5 p-4 rounded shadow-sm text-white"
        style={{
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        }}
      >
        <h3 className="mb-3 text-center">Why Your Reviews Matter</h3>
        <p>
          Reviews are powerful! Sharing your experience helps others make informed choices
          and helps restaurants improve their service.
        </p>
        <p>From a marketing perspective, reviews provide:</p>
        <ul className="list-unstyled">
          <li className="mb-2 d-flex align-items-center">
            <FaStar className="me-2" /> Boost credibility and build trust with customers
          </li>
          <li className="mb-2 d-flex align-items-center">
            <FaSearch className="me-2" /> Improve search rankings and online visibility
          </li>
          <li className="mb-2 d-flex align-items-center">
            <FaUsers className="me-2" /> Influence customer decisions and attract more visitors
          </li>
          <li className="mb-2 d-flex align-items-center">
            <FaCommentDots className="me-2" /> Provide valuable feedback for better service
          </li>
        </ul>
        <p>
          Every review you leave contributes to a stronger community and better dining experiences for everyone!
        </p>
      </div>
    </div>
  );
}
