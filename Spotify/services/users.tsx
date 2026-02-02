import { api } from './api';
import { User } from '../interfaces/User';

// Solo usar el primer usuario (el del perfil)
export const fetchFirstUser = async (): Promise<User> => {
  try {
    const res = await api.get<User[]>('/usuaris');
    
    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error('No hay usuarios en la base de datos');
    }

    const firstUser = res.data[0];
    
    if (!firstUser) {
      throw new Error('El primer usuario es nulo');
    }

    return firstUser;
  } catch (error: any) {
    console.error('Error al obtener el primer usuario:', error.message || error);
    throw error;
  }
};