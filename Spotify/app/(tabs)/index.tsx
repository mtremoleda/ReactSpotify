import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TrackSquareCard } from '../../components/TrackSquareCard';
import { PlaylistSquareCard } from '../../components/PlaylistSquareCard';
import { fetchSongs } from '../../services/Songs';
import { Song } from '../../interfaces/Song';

const HomeScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState([
    { id: '1', title: 'Mis Favoritas', songCount: 24, coverUrl: 'https://placehold.co/300x300/FF6B6B/FFFFFF?text=♥' },
    { id: '2', title: 'Relax', songCount: 18, coverUrl: 'https://placehold.co/300x300/4ECDC4/FFFFFF?text=🧘' },
    { id: '3', title: 'Energía', songCount: 32, coverUrl: 'https://placehold.co/300x300/FFD166/000000?text=⚡' },
    { id: '4', title: 'Electrónica', songCount: 45, coverUrl: 'https://placehold.co/300x300/6A0572/FFFFFF?text=🎵' },
  ]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const allSongs = await fetchSongs();
      setSongs(allSongs.slice(0, 10)); // Solo las primeras 10 canciones
    } catch (error) {
      console.error('Error al cargar canciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (id: string) => {
    router.push(`/song/${id}`);
  };

  const handlePlayPlaylist = (id: string) => {
    // Puedes redirigir a una pantalla de playlist
    console.log('Playlist seleccionada:', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1200px-Spotify_logo_with_text.svg.png' }}
            style={styles.logo}
          />
          <Text style={styles.welcome}>Buenos días, Anna</Text>
        </View>

        {/* Sección de canciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escuchar de nuevo</Text>
          <FlatList
            data={songs}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TrackSquareCard
                title={item.titol}
                artist={item.artista}
                coverUrl="https://placehold.co/300x300/1DB954/FFFFFF?text=🎵"
                onPress={() => handlePlaySong(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular esta semana</Text>
          <FlatList
            data={songs.slice(2)} // Segunda fila
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TrackSquareCard
                title={item.titol}
                artist={item.artista}
                coverUrl="https://placehold.co/300x300/1DB954/FFFFFF?text=🎵"
                onPress={() => handlePlaySong(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Sección de playlists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus playlists</Text>
          <FlatList
            data={playlists}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <PlaylistSquareCard
                title={item.title}
                coverUrl={item.coverUrl}
                songCount={item.songCount}
                onPress={() => handlePlayPlaylist(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  horizontalList: {
    paddingLeft: 0,
    paddingRight: 20,
  },
});

export default HomeScreen;