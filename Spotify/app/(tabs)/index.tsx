import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router'; // Asegúrate de tener esta importación
import { fetchSongs } from '../../services/Songs';
import { Song } from '../../interfaces/Song';
import { fetchPlaylists } from '../../services/playlists'; // Importa el nuevo servicio
import { Playlist } from '../../interfaces/Playlist'; // Importa la interfaz

const HomeScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(true);
  // Ya no necesitamos loadingPlaylists aquí si cargamos después
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(true);

  useEffect(() => {
    loadSongsAndPlaylists();
  }, []);

  const loadSongsAndPlaylists = async () => {
    // Cargar canciones primero
    try {
      const songData = await fetchSongs();
      setSongs(songData.slice(0, 4));
    } catch (err) {
      console.error('Error al cargar canciones:', err);
      setSongs([]);
    } finally {
      setLoadingSongs(false);
    }

    // Cargar playlists después de que se hayan cargado las canciones
    try {
      const playlistData = await fetchPlaylists();
      setPlaylists(playlistData.slice(0, 4));
    } catch (err) {
      console.error('Error al cargar playlists:', err);
      setPlaylists([]);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const renderSong = (item: Song) => (
   <Link href={`/song/${item.id}`} asChild>
      <TouchableOpacity style={styles.itemCard}>
        <Image
          source={{ uri: 'https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*' }}
          style={styles.albumArt}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>{item.titol}</Text>
          <Text style={styles.songArtist} numberOfLines={1}>{item.artista}</Text>
          <Text style={styles.songAlbum} numberOfLines={1}>{item.album}</Text>
        </View>
        <Text style={styles.songDuration}>{item.durada} min</Text>
      </TouchableOpacity>
    </Link>
  );

  const renderPlaylist = (item: Playlist) => (
    <Link href={`/playlists/${item.id}` as `/playlists/[id]`} asChild>  
      <TouchableOpacity style={styles.itemCard}>
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
        <Text style={styles.greeting}>Spotify</Text>
      </View>

      {/* Sección de Canciones */}
      <View style={styles.section}>
        <Text style={styles.subGreeting}>Cançons</Text>
        {loadingSongs ? (
          <Text style={styles.loading}>Cargando canciones...</Text>
        ) : (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {songs.map((song) => (
              <View key={song.id} style={styles.itemWrapper}>
                {renderSong(song)}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Sección de Playlists */}
      <View style={styles.section}>
        <Text style={styles.subGreeting}>Playlists</Text>
        {loadingPlaylists ? (
          <Text style={styles.loading}>Cargando playlists...</Text>
        ) : (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {playlists.map((playlist) => (
              <View key={playlist.id} style={styles.itemWrapper}>
                {renderPlaylist(playlist)}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
  subGreeting: {
    fontSize: 18,
    color: '#b3b3b3',
    marginTop: 10,
    paddingLeft: 20,
  },
  section: {
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemWrapper: {
    marginRight: 12,
  },
  itemCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#181818',
    borderRadius: 8,
    alignItems: 'center',
    width: 150,
  },
  albumArt: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  songInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  songTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  songAlbum: {
    color: '#b3b3b3',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  songDuration: {
    color: '#b3b3b3',
    fontSize: 10,
    marginTop: 4,
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
    fontSize: 16,
    marginTop: 20,
    paddingLeft: 20,
  },
});

export default HomeScreen;