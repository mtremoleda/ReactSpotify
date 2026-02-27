import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router'; // Usamos Link para la navegación
import { fetchPlaylists } from '../../services/playlists';
import { Playlist } from '../../interfaces/Playlist';

const PlaylistsScreen = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await fetchPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error al cargar playlists:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Tus Playlists</Text>
      </View>

      {/* Lista horizontal de playlists */}
      {loading ? (
        <Text style={styles.loading}>Cargando playlists...</Text>
      ) : (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {playlists.map((playlist) => (
            <View key={playlist.id} style={styles.playlistWrapper}>
              {renderPlaylist(playlist)}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro tipo Spotify
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  playlistWrapper: {
    marginRight: 12, // Espacio entre tarjetas
  },
  playlistCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#181818',
    borderRadius: 8,
    alignItems: 'center',
    width: 150, // Ancho fijo
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
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});

export default PlaylistsScreen;