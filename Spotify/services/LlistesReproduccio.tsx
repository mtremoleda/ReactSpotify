import { api } from './api';
import { LlistaReproduccioCancoResponse } from '../interfaces/LlistaReproduccioCancoResponse';

// Obtener todas las listas de reproducción (si las necesitas en la pantalla principal)
export const fetchLlistesReproduccio = async () => {
  try {
    console.log('Llamando a /llistes-reproduccio...');
    const res = await api.get<any[]>('/llistes-reproduccio');
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener listas:', error.message);
    throw error;
  }
};

// Obtener canciones de una lista de reproducción
export const fetchSongsFromLlista = async (llistaId: string): Promise<LlistaReproduccioCancoResponse[]> => {
  try {
    console.log(`Llamando a /llistes-reproduccio/${llistaId}/cancons...`);
    const res = await api.get<LlistaReproduccioCancoResponse[]>(`/llistes-reproduccio/${llistaId}/cancons`);
    return res.data;
  } catch (error: any) {
    console.error('Error al obtener canciones de lista:', error.message);
    throw error;
  }
};