import axios from 'axios';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getPlayerProfile = async (pi_uid: string) => {
  return api.get(`/api/players/${pi_uid}`);
};

export const startQuest = async (questId: string, pi_uid: string) => {
  return api.post('/api/quests/start', { questId, pi_uid });
};

export default api;