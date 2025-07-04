import React from 'react';

export default function Dashboard({ user }) {
  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Your UID: {user.uid}</p>
    </div>
  );
}

