import { api } from './api';
import { Playlist } from '../interfaces/Playlist';
import { LlistaReproduccioCancoResponse } from '../interfaces/LlistaReproduccioCancoResponse';

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  try {
    console.log('Llamando a /playlists...');
    const res = await api.get<Playlist[]>('/playlists');
    console.log('Playlists recibidas:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener playlists:', error.message || error);
    throw error;
  }
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
  try {
    console.log(`Llamando a /playlists/${id}...`);
    const res = await api.get<Playlist>(`/playlists/${id}`);
    console.log('Playlist recibida:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener playlist:', error.message || error);
    throw error;
  }
};

// Nuevo endpoint: Obtener canciones de una playlist
export const fetchSongsFromPlaylist = async (playlistId: string): Promise<LlistaReproduccioCancoResponse[]> => {
  try {
    console.log(`Llamando a /llistes-reproduccio/${playlistId}/cancons...`);
    const res = await api.get<LlistaReproduccioCancoResponse[]>(`/llistes-reproduccio/${playlistId}/cancons`);
    console.log('Canciones de playlist recibidas:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener canciones de playlist:', error.message || error);
    throw error;
  }
};