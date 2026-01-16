import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchSongs } from '../../services/Songs';
import { Song } from '../../interfaces/Song';

const SongDetailScreen = () => {
  const { id } = useLocalSearchParams(); // Obtiene el ID de la canción desde la URL
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSong();
  }, [id]);

  const loadSong = async () => {
    const allSongs = await fetchSongs();
    const foundSong = allSongs.find((s) => s.id === id);
    setSong(foundSong || null);
    setLoading(false);
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
        {/* Imagen de portada grande */}
        <Image
          source={{ uri: 'https://placehold.co/400' }} // Cambia por imagen real si tu API la devuelve
          style={styles.albumArtLarge}
        />

        {/* Información de la canción */}
        <View style={styles.infoContainer}>
          <Text style={styles.songTitle}>{song.titol}</Text>
          <Text style={styles.songArtist}>{song.artista}</Text>
          <Text style={styles.songAlbum}>{song.album}</Text>
          <Text style={styles.songDuration}>{song.durada} minutos</Text>

          {/* Botón de reproducción (simulado) */}
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Reproducir</Text>
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
    backgroundColor: '#1DB954', // Verde Spotify
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