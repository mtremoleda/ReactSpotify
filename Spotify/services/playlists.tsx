// services/playlists.ts
import { api } from './api';
import { Playlist } from '../interfaces/Playlist';
import { LlistaReproduccioCancoResponse } from '../interfaces/LlistaReproduccioCancoResponse';

// Esta función debe existir
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

// Esta también
export const fetchUserPlaylists = async (): Promise<Playlist[]> => {
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

// Añadir esta nueva función
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

// Tus otras funciones existentes (no las toco)
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


export const addSongToPlaylist = async (playlistId: string, songId: string): Promise<void> => {
  try {
    await api.post(`/llistes-reproduccio/${playlistId}/cancons`, {
      canco_id: songId,
    });
  } catch (error: any) {
    console.error('Error al añadir canción a playlist:', error.message || error);
    throw error;
  }
};


export const removeSongFromPlaylist = async (playlistId: string, songId: string): Promise<void> => {
  try {
    await api.delete(`/llistes-reproduccio/${playlistId}/cancons/${songId}`);
  } catch (error: any) {
    console.error('Error al eliminar canción de playlist:', error.message || error);
    throw error;
  }
};