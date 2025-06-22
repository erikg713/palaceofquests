// src/components/ItemCard.jsx
import React from 'react';

const ItemCard = ({ item, onEquip, onSell }) => {
  return (
    <div className={`p-2 border rounded-xl shadow-md bg-gradient-to-br from-blue-800 to-purple-800 text-white`}>
      <div className="text-3xl">{item.icon}</div>
      <div className="font-bold">{item.name}</div>
      <div className="text-sm">⭐ {item.stars}</div>
      <div className="text-xs italic">{item.rarity}</div>
      <div className="mt-1 flex gap-1">
        <button className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-xs" onClick={() => onEquip(item)}>Equip</button>
        <button className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs" onClick={() => onSell(item)}>Sell</button