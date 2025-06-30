import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePiAuth } from '../context/PiAuthContext';
import { fetchPlayerProfile } from '../lib/PlayerService';

export default function HomeScreen() {
  const { user } = usePiAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayer = async () => {
      if (user?.id) {
        const profile = await fetchPlayerProfile(user.id);
        setPlayer(profile);
      }
      setLoading(false);
    };

    loadPlayer();
  }, [user]);

  if (loading) return <ActivityIndicator size="large" />;
  if (!player) return <Text>No player found for this Pi UID</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Welcome back, {player.username}</Text>
      <Text>Level: {player.level}</Text>
      <Text>XP: {player.experience}</Text>
    </View>
  );
}