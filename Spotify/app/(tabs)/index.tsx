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
import { useRouter, Link } from 'expo-router';
import { TrackSquareCard } from '../../components/TrackSquareCard';
import { fetchSongs } from '../../services/Songs';
import { fetchPlaylists } from '../../services/playlists';
import { Song } from '../../interfaces/Song';
import { Playlist } from '../../interfaces/Playlist';

const HomeScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSongsAndPlaylists();
  }, []);

  const loadSongsAndPlaylists = async () => {
    try {
      const allSongs = await fetchSongs();
      setSongs(allSongs.slice(0, 10)); // Solo las primeras 10 canciones

      const allPlaylists = await fetchPlaylists();
      setPlaylists(allPlaylists);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (id: string) => {
    router.push(`/song/${id}`);
  };

  const renderPlaylist = (item: Playlist) => (
    <Link href={`/playlists/${item.id}` as `/playlists/[id]`} asChild>
      <TouchableOpacity style={styles.playlistCard}>
        {/* Icono de playlist */}
        <View style={styles.playlistIcon}>
          <Text style={styles.iconText}>🎵</Text>
        </View>
        <Text style={styles.playlistName} numberOfLines={1}>{item.nom}</Text>
      </TouchableOpacity>
    </Link>
  );

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

        {/* Sección de playlists reales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus playlists</Text>
          <FlatList
            data={playlists}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderPlaylist(item)}
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
  playlistCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#181818',
    borderRadius: 8,
    alignItems: 'center',
    width: 150, // Ancho fijo
    marginRight: 12,
  },
  playlistIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#282828',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  playlistName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;