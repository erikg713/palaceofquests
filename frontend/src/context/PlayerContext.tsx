import { createContext, useState, useContext, ReactNode } from 'react';

type Player = {
  username: string;
  level: number;
  inventory: string[];
};

const defaultPlayer: Player = {
  username: 'guest',
  level: 1,
  inventory: [],
};

const PlayerContext = createContext<{
  player: Player;
  setPlayer: (p: Player) => void;
}>({
  player: defaultPlayer,
  setPlayer: () => {},
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player>(defaultPlayer);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);