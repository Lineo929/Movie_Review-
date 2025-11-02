import React from "react";

export default function Reviews({ reviews }) {
  return (
    <div className="mt-4">
      <h4>Reviews</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="card mb-2 p-2 shadow-sm">
            <strong>{r.user}</strong>
            <p>{r.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
