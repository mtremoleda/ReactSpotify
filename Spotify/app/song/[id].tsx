import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { fetchSongs } from '../../services/Songs';
import { Song } from '../../interfaces/Song';
import { fetchFirstUser } from '../../services/users';

const SongDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Usuario');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadSongAndUser();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [id]);

  const loadSongAndUser = async () => {
    try {
      const allSongs = await fetchSongs();
      const foundSong = allSongs.find((s) => s.id === id);
      setSong(foundSong || null);

      // Obtener el usuario del perfil (el que ya tienes)
      const user = await fetchFirstUser();
      setUserName(user.nom);
    } catch (error) {
      console.error('Error al cargar canción o usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inicializar WebSocket una sola vez
  const initWebSocket = () => {
    if (wsRef.current) return; // Ya existe

    console.log('Iniciando conexión WebSocket...');
    const ws = new WebSocket('ws://172.23.58.247:5085/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Conectado al servidor WebSocket');
      // Enviar nombre de usuario una vez
      ws.send(`USUARIO:${userName}`);
    };

    ws.onmessage = (event) => {
      console.log('📢 Mensaje del servidor:', event.data);
    };

    ws.onerror = (error) => {
      console.error('❌ Error WebSocket:', error);
      wsRef.current = null;
    };

    ws.onclose = () => {
      console.log('🔒 Conexión WebSocket cerrada');
      wsRef.current = null;
    };
  };

  // Enviar canción actual (reutiliza la misma conexión)
  const sendCurrentSong = (songName: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      initWebSocket();
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(`CANCION:${songName}`);
        }
      }, 300);
    } else {
      wsRef.current.send(`CANCION:${songName}`);
    }
  };

  const playAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg' }
      );
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);

      if (song) {
        sendCurrentSong(song.titol);
      }
    } catch (error: any) {
      console.error('Error al reproducir el audio:', error.message || error);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando detalles...</Text>
      </SafeAreaView>
    );
  }

  if (!song) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Canción no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: 'https://cdn-images.dzcdn.net/images/cover/4c1bfb589c432b2c82aa0eeb04c52f1b/1900x1900-000000-80-0-0.jpg' }}
          style={styles.albumArtLarge}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.songTitle}>{song.titol}</Text>
          <Text style={styles.songArtist}>{song.artista}</Text>
          <Text style={styles.songAlbum}>{song.album}</Text>
          <Text style={styles.songDuration}>{song.durada} minutos</Text>

          <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
            <Text style={styles.playButtonText}>{isPlaying ? '⏸ Pausar' : '▶ Reproducir'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  albumArtLarge: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  songArtist: {
    fontSize: 20,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 8,
  },
  songAlbum: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 12,
  },
  songDuration: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});

export default SongDetailScreen;