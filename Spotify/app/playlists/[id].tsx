import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Song } from '../../interfaces/Song';

// Datos ficticios de canciones por playlist
const mockPlaylistSongs: Record<string, Song[]> = {
  'd7e8f9a0-b1c2-8008-d008-0123456789ab': [
    {
      id: '1',
      titol: 'Canción 1',
      artista: 'Artista A',
      album: 'Álbum A',
      durada: 240,
    },
    {
      id: '2',
      titol: 'Canción 2',
      artista: 'Artista B',
      album: 'Álbum B',
      durada: 180,
    },
  ],
  'e8f9a0b1-c2d3-8009-d009-123456789abc': [
    {
      id: '3',
      titol: 'Canción 3',
      artista: 'Artista C',
      album: 'Álbum C',
      durada: 200,
    },
    {
      id: '4',
      titol: 'Canción 4',
      artista: 'Artista D',
      album: 'Álbum D',
      durada: 220,
    },
  ],
  'f9a0b1c2-d3e4-800a-d00a-23456789abcd': [
    {
      id: '5',
      titol: 'Canción 5',
      artista: 'Artista E',
      album: 'Álbum E',
      durada: 190,
    },
    {
      id: '6',
      titol: 'Canción 6',
      artista: 'Artista F',
      album: 'Álbum F',
      durada: 210,
    },
  ],
  'c0d1e2f3-a4b5-8001-d001-9abcdef01234': [
    {
      id: '7',
      titol: 'Canción 7',
      artista: 'Artista G',
      album: 'Álbum G',
      durada: 230,
    },
    {
      id: '8',
      titol: 'Canción 8',
      artista: 'Artista H',
      album: 'Álbum H',
      durada: 250,
    },
  ],
};

const PlaylistDetailScreen = () => {
  const { id } = useLocalSearchParams(); // ID de la playlist
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPlaylistSongs();
  }, [id]);

  const loadPlaylistSongs = async () => {
    setLoading(true);
    // Simula una llamada asíncrona
    setTimeout(() => {
      const songs = mockPlaylistSongs[id as string] || [];
      setPlaylistSongs(songs);
      setLoading(false);
    }, 500);
  };

  const renderSong = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.songCard}>
      <Image
        source={{ uri: 'https://placehold.co/60' }}
        style={styles.albumArt}
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.titol}</Text>
        <Text style={styles.songArtist}>{item.artista}</Text>
        <Text style={styles.songAlbum}>{item.album}</Text>
      </View>
      <Text style={styles.songDuration}>{item.durada} min</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.playlistTitle}>Canciones en la Playlist</Text>

      {loading ? (
        <Text style={styles.loading}>Cargando canciones...</Text>
      ) : (
        <FlatList
          data={playlistSongs}
          renderItem={renderSong}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
  },
  list: {
    padding: 20,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#181818',
    borderRadius: 8,
    marginBottom: 12,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 14,
    marginTop: 2,
  },
  songAlbum: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 2,
  },
  songDuration: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});

export default PlaylistDetailScreen;