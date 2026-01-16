import { api } from './api';
import { Playlist } from '../interfaces/Playlist';

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  try {
    const res = await api.get<Playlist[]>('/playlists'); // Asegúrate de que tu endpoint sea este
    return res.data;
  } catch (error) {
    console.error('Error al obtener las playlists:', error);
    return [];
  }
};