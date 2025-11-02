import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Details from "./pages/Details.jsx"; // ✅ updated name
import AddReviewPage from "./pages/AddReviewPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"; // ✅ new Register page
import Profile from "./pages/Profile.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
        setUserData({
          name: user.displayName || "",
          email: user.email,
          phone: user.phoneNumber || "",
        });
      } else {
        setUserLoggedIn(false);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  
  const ProtectedRoute = ({ children }) => {
    if (!userLoggedIn) {
      alert("You must log in to access this page!");
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Navbar userLoggedIn={userLoggedIn} />
      <div className="main-container">
        <Routes>
          <Route
            path="/"
            element={<Home userLoggedIn={userLoggedIn} />}
          />
          <Route
            path="/restaurant/:id"
            element={<Details userLoggedIn={userLoggedIn} />}
          />
          <Route
            path="/add-review"
            element={
              <ProtectedRoute>
                <AddReviewPage userLoggedIn={userLoggedIn} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={<Login setUserLoggedIn={setUserLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile userLoggedIn={userLoggedIn} userData={userData} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
