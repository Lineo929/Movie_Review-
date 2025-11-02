import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase"; // make sure db is Firestore instance
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    
      await updateProfile(userCredential.user, { displayName: name });

   
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        phone: "",
        address: "",
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="mt-5" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center mb-4">Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Login here
        </Link>
      </p>
    </div>
  );
}
