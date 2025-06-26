import React from 'react';

const InventorySkeleton = () => (
  <ul className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, idx) => (
      <li key={idx} className="bg-gray-700 h-12 rounded w-full" />
    ))}
  </ul>
);

export default InventorySkeleton;
