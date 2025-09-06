import React, { useState } from "react";
import { CharacterStats, InventoryItem, Quest } from "../types/gameTypes";
import WorldMap from "./WorldMap";
import QuestTab from "./QuestTab";
import InventoryTab from "./InventoryTab";
import SocialTab from "./SocialTab";
import CharacterTab from "./CharacterTab";
import GuildTab from "./GuildTab";
import Web3Status from "./Web3Status";
import TabBar from "./TabBar";

interface GameInterfaceProps {
  character: CharacterStats;
  inventory: InventoryItem[];
  quests: Quest[];
  piBalance: number;
}

export type GameTab = "World" | "Quests" | "Inventory" | "Social" | "Character" | "Guild";

const GameInterface: React.FC<GameInterfaceProps> = ({
  character,
  inventory,
  quests,
  piBalance,
}) => {
  const [activeTab, setActiveTab] = useState<GameTab>("World");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "World":
        return <WorldMap />;
      case "Quests":
        return <QuestTab quests={quests} />;
      case "Inventory":
        return <InventoryTab inventory={inventory} />;
      case "Social":
        return <SocialTab />;
      case "Character":
        return <CharacterTab character={character} />;
      case "Guild":
        return <GuildTab />;
      default:
        return <WorldMap />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-800 to-indigo-900 text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-indigo-950 shadow-md">
        <h2 className="text-xl font-bold">{character.name}</h2>
        <Web3Status piBalance={piBalance} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">{renderActiveTab()}</div>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default GameInterface;
