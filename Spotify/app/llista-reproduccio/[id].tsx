import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchSongsFromLlista } from '../../services/LlistesReproduccio';
import { LlistaReproduccioCancoResponse } from '../../interfaces/LlistaReproduccioCancoResponse';

const LlistaReproduccioDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [songs, setSongs] = useState<LlistaReproduccioCancoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSongs();
  }, [id]);

  const loadSongs = async () => {
    try {
      const songsData = await fetchSongsFromLlista(id as string);
      setSongs(songsData);
    } catch (error) {
      console.error('Error al cargar canciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSong = ({ item }: { item: LlistaReproduccioCancoResponse }) => (
    <TouchableOpacity style={styles.songRow}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.titol}</Text>
        <Text style={styles.songArtist}>{item.artista}</Text>
        <Text style={styles.songAlbum}>{item.album}</Text>
      </View>
      <Text style={styles.songDuration}>{item.durada || 0} min</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de reproducción</Text>
        <Text style={styles.subtitle}>{songs.length} canciones</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
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
  songDuration: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  loading: {
    textAlign: 'center',
    color: '#B3B3B3',
    marginTop: 20,
  },
});

export default LlistaReproduccioDetailScreen;