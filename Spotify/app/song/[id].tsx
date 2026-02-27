import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Song } from '../../interfaces/Song';
import { addSongToPlaylist, fetchUserPlaylists } from '../../services/playlists';
import { fetchSongs } from '../../services/Songs';
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
    // return () => {
      
    //   if (isPlaying && wsRef.current) {
    //     wsRef.current.close();
    //     wsRef.current = null;
    //   }
    // };
  }, [id]);

  const loadSongAndUser = async () => {
    try {
      const allSongs = await fetchSongs();
      const foundSong = allSongs.find((s) => s.id === id);
      setSong(foundSong || null);

      const user = await fetchFirstUser();
      setUserName(user.nom);
    } catch (error) {
      console.error('Error al cargar canción o usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = () => {
    if (!song) return;

    fetchUserPlaylists()
      .then(playlists => {
        if (!Array.isArray(playlists) || playlists.length === 0) {
          Alert.alert('Sin playlists', 'No tienes ninguna playlist para añadir canciones');
          return;
        }

        // Asegurarnos de que cada playlist tenga 'nom'
        const options = playlists.map(playlist => {
          const title = playlist.nom || 'Playlist sin nombre';
          return {
            text: title,
            onPress: () => addToPlaylist(playlist.id, song.id),
          };
        });

        Alert.alert(
          'Añadir a playlist',
          'Selecciona una playlist:',
          [...options, { text: 'Cancelar', style: 'cancel' }]
        );
      })
      .catch(error => {
        console.error('Error al cargar playlists:', error);
        Alert.alert('Error', 'No se pudieron cargar las playlists');
      });
  };

  const addToPlaylist = async (playlistId: string, songId: string) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      Alert.alert('Éxito', 'Canción añadida a la playlist');
    } catch (error) {
      console.error('Error al añadir canción:', error);
      Alert.alert('Error', 'No se pudo añadir la canción a la playlist');
    }
  };

  // Inicialitzar WebSocket un sol cop
  const initWebSocket = () => {
    if (wsRef.current) return; // Si ja hi ha un web socket agafa aquest

    console.log('Iniciant conexió WebSocket...');
    const ws = new WebSocket('ws://172.23.58.247:5085/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Conectant al servidor WebSocket');
      // Enviar nombre de usuario una vez
      ws.send(`USUARI:${userName}`);
    };

    ws.onmessage = (event) => {
      console.log('Missatge del servidor:', event.data);
    };

    ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
      wsRef.current = null;
    };

    ws.onclose = () => {
      console.log('Conexió WebSocket tencada');
      wsRef.current = null;
    };
  };

  // Enviar canço actual 
  const sendCurrentSong = (songName: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      initWebSocket();
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(`CANÇO:${songName}`);
        }
      }, 300);
    } else {
      wsRef.current.send(`CANÇO:${songName}`);
    }
  };

  const playAudio = async () => {
    try {
      
      // const { sound } = await Audio.Sound.createAsync(
      //   { uri: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg' }
      // );

      const { sound } = await Audio.Sound.createAsync(
        require('../../../Spotify/Musica/Hala_Madrid.mp3')
      );
      // "C:\Users\User\Downloads\Hala Madrid...y nada más (feat. RedOne) ｜ Himno de la Décima.mp3"
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);

      if (song) {
        sendCurrentSong(song.titol);
      }
    } catch (error: any) {
      console.error('Error al reproduir audio:', error.message || error);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }

    // Cerrar WebSocket cuando se pause la canción
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
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

          {/* Botón para añadir a playlist */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddToPlaylist}>
            <Text style={styles.addButtonText}>Agregar a playlist +</Text>
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
  addButton: {
    backgroundColor: '#535353',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
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