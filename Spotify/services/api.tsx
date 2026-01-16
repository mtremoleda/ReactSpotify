import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://172.23.58.247:5080',
});