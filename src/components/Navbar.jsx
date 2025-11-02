import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <NavLink className="navbar-brand" to="/">FoodReviews</NavLink>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav ms-auto">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/add-review">Add Review</NavLink>
          <NavLink className="nav-link" to="/profile">Profile</NavLink>
          <NavLink className="nav-link" to="/login">Login</NavLink>
        </div>
      </div>
    </nav>
  );
}
