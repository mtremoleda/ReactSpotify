import { api } from './api';
import { User } from '../interfaces/User';

export const fetchFirstUser = async (): Promise<User> => {
  try {
    console.log('Llamando a /usuaris...');
    const res = await api.get<User[]>('/usuaris');
    console.log('Respuesta recibida:', res.data);

    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error('No hay usuarios en la base de datos');
    }

    const firstUser = res.data[0];
    console.log('Usuario encontrado:', firstUser);

    if (!firstUser) {
      throw new Error('El primer usuario es nulo');
    }

    return firstUser;
  } catch (error: any) {
    console.error('Error al obtener el primer usuario:', error.message || error);
    throw error;
  }
};