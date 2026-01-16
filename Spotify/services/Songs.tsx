import { api } from './api';
import { Song } from '../interfaces/Song';

export const fetchSongs = async (): Promise<Song[]> => {
  console.log('Llamando a la API en:', api.defaults.baseURL + '/cancons');
  try {
    const res = await api.get<Song[]>('/cancons');
    console.log('Respuesta recibida:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener las canciones:', error.message || error);
    return [];
  }
};