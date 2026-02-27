import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPlaylistById, fetchSongsFromPlaylist, removeSongFromPlaylist } from '../../services/playlists';
import { Playlist } from '../../interfaces/Playlist';
import { LlistaReproduccioCancoResponse } from '../../interfaces/LlistaReproduccioCancoResponse';

const PlaylistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<LlistaReproduccioCancoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const loadPlaylist = async () => {
    try {
      // Cargar información básica de la playlist
      const playlistData = await fetchPlaylistById(id as string);
      setPlaylist(playlistData);

      // Cargar canciones de la playlist
      const playlistSongs = await fetchSongsFromPlaylist(id as string);
      setSongs(playlistSongs);
    } catch (error) {
      console.error('Error al cargar playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSong = (songId: string) => {
    Alert.alert(
      'Eliminar canción',
      '¿Estás seguro de que quieres eliminar esta canción de la playlist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeSongFromPlaylist(id as string, songId);
              Alert.alert('Éxito', 'Canción eliminada de la playlist');
              loadPlaylist(); // Refrescar la lista
            } catch (error) {
              console.error('Error al eliminar canción:', error);
              Alert.alert('Error', 'No se pudo eliminar la canción');
            }
          },
        },
      ]
    );
  };

  const handlePlaySong = (songId: string) => {
    // Aquí puedes redirigir a la canción específica si tienes el ID
    console.log('Canción seleccionada:', songId);
    // router.push(`/song/${songId}`); // Descomenta cuando tengas la ruta
  };

  const renderSong = ({ item }: { item: LlistaReproduccioCancoResponse }) => (
    <TouchableOpacity style={styles.songRow} onPress={() => handlePlaySong(item.id)}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.titol}</Text>
        <Text style={styles.songArtist}>{item.artista}</Text>
        <Text style={styles.songAlbum}>{item.album}</Text>
      </View>
      <View style={styles.songActions}>
        <Text style={styles.songDuration}>{item.durada || 0} min</Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveSong(item.id)}
        >
          <Text style={styles.removeButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando playlist...</Text>
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Playlist no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ 
            uri: "https://placehold.co/300x300/6A0572/FFFFFF?text=🎵" 
          }} 
          style={styles.playlistCover} 
        />
        <Text style={styles.playlistTitle}>{playlist.nom}</Text>
        <Text style={styles.playlistMeta}>{songs.length} canciones</Text>
      </View>

      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.songsList}
      />
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
    alignItems: 'center',
  },
  playlistCover: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  playlistMeta: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  songsList: {
    padding: 20,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 12,
    color: '#535353',
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songDuration: {
    fontSize: 14,
    color: '#B3B3B3',
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 3,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  loading: {
    textAlign: 'center',
    color: '#B3B3B3',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    color: '#B3B3B3',
    marginTop: 20,
  },
});

export default PlaylistDetailScreen;