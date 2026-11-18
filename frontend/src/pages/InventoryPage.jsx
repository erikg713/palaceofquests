import React, { useState } from 'react';
import InventoryErrorBoundary from '../components/InventoryErrorBoundary';
import { inventoryData } from '../data/items';

const LOOT_KEY = 'poq-inventory-v1';
// Every adventurer starts with a health potion in their pack.
const STARTER_ITEMS = ['p1'];

function loadOwned() {
  try {
    const raw = localStorage.getItem(LOOT_KEY);
    const loot = raw ? JSON.parse(raw) : [];
    return Array.from(new Set([...STARTER_ITEMS, ...loot]));
  } catch {
    return [...STARTER_ITEMS];
  }
}

function allItems() {
  return Object.entries(inventoryData).flatMap(([category, items]) =>
    items.map((item) => ({ ...item, type: category }))
  );
}

export default function InventoryPage() {
  const [owned] = useState(loadOwned);
  const items = allItems().filter((item) => owned.includes(item.id));

  return (
    <main
      className="max-w-2xl mx-auto py-8 text-white"
      aria-labelledby="inventory-heading"
    >
      <header>
        <h1
          id="inventory-heading"
          className="text-3xl font-bold mb-2"
          tabIndex={0}
        >
          🎒 Your Inventory
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Loot from completed quests lands here. Progress is saved on this
          device until the backend inventory is connected.
        </p>
      </header>
      <InventoryErrorBoundary>
        {items.length === 0 ? (
          <p className="text-gray-400">
            Your pack is empty. Complete a quest to earn loot!
          </p>
        ) : (
          <div className="inventory-grid grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 p-3 rounded-xl border border-purple-500 hover:scale-105 transition-transform"
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="item-name text-lg font-semibold mt-1">
                  {item.name}
                </h3>
                <p className="text-sm text-purple-300 capitalize">
                  {item.rarity} {item.type}
                </p>
                <p className="text-sm text-gray-400">{item.description}</p>
                <p className="text-sm text-gold mt-1">
                  {'★'.repeat(item.stars)}
                  {'☆'.repeat(5 - item.stars)}
                </p>
              </div>
            ))}
          </div>
        )}
      </InventoryErrorBoundary>
    </main>
  );
}
